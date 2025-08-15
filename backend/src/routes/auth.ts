import { Router, Request, Response } from "express";
import crypto from "crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

// JWT configuration
const JWT_SECRET =
  process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production";
const JWT_EXPIRES_IN = "7d";
const REFRESH_TOKEN_EXPIRES_IN = "30d";

// In-memory storage for demo purposes (use Redis or database in production)
interface ResetAttempt {
  nssfNumber: string;
  email?: string;
  phone?: string;
  verificationCode: string;
  token: string;
  attempts: number;
  createdAt: Date;
  expiresAt: Date;
  verified: boolean;
}

const resetAttempts = new Map<string, ResetAttempt>();
const attemptCounts = new Map<string, { count: number; lastAttempt: Date }>();

// Rate limiting configuration
const RATE_LIMIT = {
  maxAttempts: 3,
  windowMinutes: 15,
  codeValidMinutes: 10,
  tokenValidMinutes: 30,
};

// Mock user database (in production, use real database)
const mockUsers = new Map([
  [
    "john.mukasa",
    {
      nssfNumber: "NSS12345678",
      email: "john.mukasa@example.com",
      phone: "+256701234567",
      hashedPassword: "$2b$10$example_hash", // In production, use proper bcrypt hash
    },
  ],
  [
    "mary.nakato",
    {
      nssfNumber: "NSS87654321",
      email: "mary.nakato@example.com",
      phone: "+256707654321",
      hashedPassword: "$2b$10$example_hash2",
    },
  ],
]);

// Utility functions
const validateNSSFNumber = (nssfNumber: string): boolean => {
  const nssfRegex = /^(NSS-?)?\d{8,12}$/i;
  return nssfRegex.test(nssfNumber.replace(/\s/g, ""));
};

const checkRateLimit = (identifier: string): boolean => {
  const now = new Date();
  const attempts = attemptCounts.get(identifier);

  if (!attempts) {
    attemptCounts.set(identifier, { count: 1, lastAttempt: now });
    return true;
  }

  const timeDiff =
    (now.getTime() - attempts.lastAttempt.getTime()) / (1000 * 60);

  if (timeDiff > RATE_LIMIT.windowMinutes) {
    // Reset if outside window
    attemptCounts.set(identifier, { count: 1, lastAttempt: now });
    return true;
  }

  if (attempts.count >= RATE_LIMIT.maxAttempts) {
    return false;
  }

  attempts.count++;
  attempts.lastAttempt = now;
  return true;
};

const generateSecureCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const generateSecureToken = (): string => {
  return crypto.randomBytes(32).toString("hex");
};

const findUserByNSSF = (nssfNumber: string) => {
  for (const [username, user] of mockUsers) {
    if (user.nssfNumber.toLowerCase() === nssfNumber.toLowerCase()) {
      return { username, ...user };
    }
  }
  return null;
};

// Simulate sending verification code
const sendVerificationCode = async (
  method: "email" | "sms",
  contact: string,
  code: string
): Promise<boolean> => {
  // In production, integrate with email/SMS services
  console.log(`Sending ${method} to ${contact}: Verification code is ${code}`);

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return true; // Always successful in demo
};

// Placeholder routes - will be implemented with full functionality
router.post("/login", async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("🔍 Login route received request body:", req.body);
    const { username, password } = req.body;
    console.log(
      "🎯 Extracted username:",
      username,
      "password length:",
      password?.length
    );

    // Validation
    if (!username || !password) {
      console.log("❌ Validation failed - missing username or password");
      res.status(400).json({
        success: false,
        message: "Username and password are required",
      });
      return;
    }

    // Find user by username (can be username or NSSF number)
    console.log("🔍 Searching for user with username:", username.trim());
    const user = await prisma.users.findFirst({
      where: {
        username: username.trim(),
        is_active: true,
      },
      include: {
        pensioners: {
          select: {
            pensioner_id: true,
            nssf_number: true,
            first_name: true,
            last_name: true,
            email_address: true,
            phone_number: true,
          },
        },
      },
    });

    console.log("🔍 User found:", user ? `Yes (${user.username})` : "No");
    if (!user) {
      console.log("❌ User not found in database");
      res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
      return;
    }

    // Check if account is locked
    if (user.is_locked) {
      res.status(423).json({
        success: false,
        message: "Account is locked. Please contact support.",
      });
      return;
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      // Increment failed login attempts
      await prisma.users.update({
        where: { user_id: user.user_id },
        data: {
          failed_login_attempts: {
            increment: 1,
          },
          // Lock account after 5 failed attempts
          is_locked: user.failed_login_attempts >= 4,
        },
      });

      res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
      return;
    }

    // Reset failed login attempts on successful login
    await prisma.users.update({
      where: { user_id: user.user_id },
      data: {
        failed_login_attempts: 0,
        last_login: new Date(),
      },
    });

    // Generate JWT tokens
    const accessToken = jwt.sign(
      {
        userId: user.user_id,
        username: user.username,
        role: user.role,
        pensionerId: user.pensioner_id,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    const refreshToken = jwt.sign({ userId: user.user_id }, JWT_SECRET, {
      expiresIn: REFRESH_TOKEN_EXPIRES_IN,
    });

    // Store refresh token in database
    const refreshTokenExpiry = new Date();
    refreshTokenExpiry.setDate(refreshTokenExpiry.getDate() + 30);

    await prisma.users.update({
      where: { user_id: user.user_id },
      data: {
        refresh_token: refreshToken,
        refresh_token_expires_at: refreshTokenExpiry,
      },
    });

    // Prepare user data for response
    const userData = {
      id: user.user_id,
      username: user.username,
      role: user.role,
      pensioner: user.pensioners
        ? {
            id: user.pensioners.pensioner_id,
            nssfNumber: user.pensioners.nssf_number,
            firstName: user.pensioners.first_name,
            lastName: user.pensioners.last_name,
            email: user.pensioners.email_address,
            phone: user.pensioners.phone_number,
          }
        : null,
      lastLogin: user.last_login,
      mustChangePassword: user.must_change_password,
    };

    res.json({
      success: true,
      message: "Login successful",
      data: {
        user: userData,
        accessToken,
        refreshToken,
        expiresIn: JWT_EXPIRES_IN,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

router.post("/logout", async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (refreshToken) {
      // Invalidate refresh token in database
      await prisma.users.updateMany({
        where: { refresh_token: refreshToken },
        data: {
          refresh_token: null,
          refresh_token_expires_at: null,
          current_session_token: null,
          session_expires_at: null,
        },
      });
    }

    res.json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

router.post("/refresh", async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(401).json({
        success: false,
        message: "Refresh token is required",
      });
      return;
    }

    // Verify refresh token
    let decoded: any;
    try {
      decoded = jwt.verify(refreshToken, JWT_SECRET);
    } catch (error) {
      res.status(401).json({
        success: false,
        message: "Invalid refresh token",
      });
      return;
    }

    // Find user and validate refresh token
    const user = await prisma.users.findFirst({
      where: {
        user_id: decoded.userId,
        refresh_token: refreshToken,
        refresh_token_expires_at: {
          gt: new Date(),
        },
        is_active: true,
      },
      include: {
        pensioners: {
          select: {
            pensioner_id: true,
            nssf_number: true,
            first_name: true,
            last_name: true,
          },
        },
      },
    });

    if (!user) {
      res.status(401).json({
        success: false,
        message: "Invalid or expired refresh token",
      });
      return;
    }

    // Generate new access token
    const accessToken = jwt.sign(
      {
        userId: user.user_id,
        username: user.username,
        role: user.role,
        pensionerId: user.pensioner_id,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.json({
      success: true,
      data: {
        accessToken,
        expiresIn: JWT_EXPIRES_IN,
      },
    });
  } catch (error) {
    console.error("Token refresh error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Step 1: Initiate password reset
router.post(
  "/forgot-password/initiate",
  async (req: Request, res: Response) => {
    try {
      const { nssfNumber } = req.body;

      // Validation
      if (!nssfNumber) {
        return res.status(400).json({
          success: false,
          message: "NSSF number is required",
        });
      }

      if (!validateNSSFNumber(nssfNumber)) {
        return res.status(400).json({
          success: false,
          message: "Invalid NSSF number format",
        });
      }

      // Rate limiting
      const clientIP = req.ip || req.connection.remoteAddress || "unknown";
      if (!checkRateLimit(`${clientIP}-${nssfNumber}`)) {
        return res.status(429).json({
          success: false,
          message: `Too many attempts. Please wait ${RATE_LIMIT.windowMinutes} minutes before trying again.`,
        });
      }

      // Check if user exists
      const user = findUserByNSSF(nssfNumber);
      if (!user) {
        // Return success even if user not found (security best practice)
        return res.json({
          success: true,
          message:
            "If this NSSF number exists, you will receive verification options.",
        });
      }

      // Generate session token
      const sessionToken = generateSecureToken();
      const now = new Date();

      // Store reset session
      resetAttempts.set(sessionToken, {
        nssfNumber: user.nssfNumber,
        email: user.email,
        phone: user.phone,
        verificationCode: "",
        token: sessionToken,
        attempts: 0,
        createdAt: now,
        expiresAt: new Date(
          now.getTime() + RATE_LIMIT.tokenValidMinutes * 60000
        ),
        verified: false,
      });

      return res.json({
        success: true,
        sessionToken,
        availableMethods: ["email", "sms"],
        message: "NSSF number verified. Choose verification method.",
      });
    } catch (error) {
      console.error("Forgot password initiate error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
);

// Step 2: Send verification code
router.post(
  "/forgot-password/send-code",
  async (req: Request, res: Response) => {
    try {
      const { sessionToken, method } = req.body;

      if (!sessionToken || !method) {
        return res.status(400).json({
          success: false,
          message: "Session token and method are required",
        });
      }

      if (!["email", "sms"].includes(method)) {
        return res.status(400).json({
          success: false,
          message: "Invalid verification method",
        });
      }

      const resetData = resetAttempts.get(sessionToken);
      if (!resetData || resetData.expiresAt < new Date()) {
        return res.status(400).json({
          success: false,
          message: "Invalid or expired session",
        });
      }

      // Generate and send verification code
      const verificationCode = generateSecureCode();
      const contact = method === "email" ? resetData.email : resetData.phone;

      if (!contact) {
        return res.status(400).json({
          success: false,
          message: `No ${method} address on file`,
        });
      }

      try {
        await sendVerificationCode(
          method as "email" | "sms",
          contact,
          verificationCode
        );
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: `Failed to send verification code via ${method}`,
        });
      }

      // Update reset data
      resetData.verificationCode = verificationCode;
      resetData.verified = false;
      const now = new Date();
      resetData.expiresAt = new Date(
        now.getTime() + RATE_LIMIT.codeValidMinutes * 60000
      );

      return res.json({
        success: true,
        message: `Verification code sent to your ${method}`,
        expiresIn: RATE_LIMIT.codeValidMinutes,
      });
    } catch (error) {
      console.error("Send verification code error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
);

// Step 3: Verify code
router.post("/forgot-password/verify-code", (req: Request, res: Response) => {
  try {
    const { sessionToken, verificationCode } = req.body;

    if (!sessionToken || !verificationCode) {
      return res.status(400).json({
        success: false,
        message: "Session token and verification code are required",
      });
    }

    const resetData = resetAttempts.get(sessionToken);
    if (!resetData || resetData.expiresAt < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired session",
      });
    }

    if (resetData.attempts >= 3) {
      return res.status(400).json({
        success: false,
        message: "Too many verification attempts",
      });
    }

    resetData.attempts++;

    if (resetData.verificationCode !== verificationCode) {
      return res.status(400).json({
        success: false,
        message: "Invalid verification code",
        attemptsRemaining: 3 - resetData.attempts,
      });
    }

    // Mark as verified and extend session
    resetData.verified = true;
    const now = new Date();
    resetData.expiresAt = new Date(
      now.getTime() + RATE_LIMIT.tokenValidMinutes * 60000
    );

    return res.json({
      success: true,
      message: "Verification successful",
    });
  } catch (error) {
    console.error("Verify code error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Step 4: Reset password
router.post("/forgot-password/reset", async (req: Request, res: Response) => {
  try {
    const { sessionToken, newPassword } = req.body;

    if (!sessionToken || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Session token and new password are required",
      });
    }

    const resetData = resetAttempts.get(sessionToken);
    if (!resetData || resetData.expiresAt < new Date() || !resetData.verified) {
      return res.status(400).json({
        success: false,
        message: "Invalid, expired, or unverified session",
      });
    }

    // Validate password strength
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        success: false,
        message: "Password does not meet security requirements",
        requirements: [
          "At least 8 characters",
          "At least one uppercase letter",
          "At least one lowercase letter",
          "At least one number",
          "At least one special character",
        ],
      });
    }

    // In production, hash the password and update database
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    console.log(
      `Password reset for NSSF: ${resetData.nssfNumber}, New hash: ${hashedPassword}`
    );

    // Clean up reset session
    resetAttempts.delete(sessionToken);

    return res.json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Legacy endpoint (kept for compatibility)
router.post("/forgot-password", (_req: Request, res: Response) => {
  res.json({
    message: "Please use /forgot-password/initiate to start the reset process",
    endpoints: {
      initiate: "POST /auth/forgot-password/initiate",
      sendCode: "POST /auth/forgot-password/send-code",
      verifyCode: "POST /auth/forgot-password/verify-code",
      reset: "POST /auth/forgot-password/reset",
    },
  });
});

router.post("/reset-password", (_req: Request, res: Response) => {
  res.json({ message: "Reset password endpoint - implementation in progress" });
});

router.post("/change-password", (_req: Request, res: Response) => {
  res.json({
    message: "Change password endpoint - implementation in progress",
  });
});

export default router;
