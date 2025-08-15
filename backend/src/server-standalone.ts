import express, { Request, Response } from "express";
import cors from "cors";
import crypto from "crypto";
import bcrypt from "bcrypt";

// Create Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
  })
);
app.use(express.json());

// Request logging middleware
app.use((req: Request, _res: Response, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
});

// Test endpoint
app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", message: "Server is running" });
});

// Test API endpoint
app.get("/api/test", (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    message: "API is working",
    timestamp: new Date().toISOString(),
  });
});

// In-memory storage for demo purposes
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

// Mock user database
const mockUsers = new Map([
  [
    "john.mukasa",
    {
      nssfNumber: "NSS12345678",
      email: "john.mukasa@example.com",
      phone: "+256701234567",
      hashedPassword: "$2b$10$example_hash",
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

// Auth routes
app.post(
  "/api/v1/auth/forgot-password/initiate",
  async (req: Request, res: Response) => {
    try {
      const { nssfNumber } = req.body;

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

      const clientIP = req.ip || req.socket.remoteAddress || "unknown";
      if (!checkRateLimit(`${clientIP}-${nssfNumber}`)) {
        return res.status(429).json({
          success: false,
          message: `Too many attempts. Please wait ${RATE_LIMIT.windowMinutes} minutes before trying again.`,
        });
      }

      const user = findUserByNSSF(nssfNumber);
      if (!user) {
        return res.json({
          success: true,
          message:
            "If this NSSF number exists, you will receive verification options.",
        });
      }

      const sessionToken = generateSecureToken();
      const now = new Date();

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

app.post(
  "/api/v1/auth/forgot-password/send-code",
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

      const verificationCode = generateSecureCode();
      const contact = method === "email" ? resetData.email : resetData.phone;

      if (!contact) {
        return res.status(400).json({
          success: false,
          message: `No ${method} address on file`,
        });
      }

      console.log(
        `Sending ${method} to ${contact}: Verification code is ${verificationCode}`
      );

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

app.post(
  "/api/v1/auth/forgot-password/verify-code",
  (req: Request, res: Response) => {
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
  }
);

app.post(
  "/api/v1/auth/forgot-password/reset",
  async (req: Request, res: Response) => {
    try {
      const { sessionToken, newPassword } = req.body;

      if (!sessionToken || !newPassword) {
        return res.status(400).json({
          success: false,
          message: "Session token and new password are required",
        });
      }

      const resetData = resetAttempts.get(sessionToken);
      if (
        !resetData ||
        resetData.expiresAt < new Date() ||
        !resetData.verified
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid, expired, or unverified session",
        });
      }

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

      const hashedPassword = await bcrypt.hash(newPassword, 12);
      console.log(
        `Password reset for NSSF: ${resetData.nssfNumber}, New hash: ${hashedPassword}`
      );

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
  }
);

// Start server
const port = Number(PORT);
app
  .listen(port, "0.0.0.0", () => {
    console.log(`🚀 Backend server running on http://localhost:${port}`);
    console.log(`🏥 Health check: http://localhost:${port}/health`);
    console.log(
      `🔐 Forgot password API: http://localhost:${port}/api/v1/auth/forgot-password/initiate`
    );
  })
  .on("error", (err) => {
    console.error("Server failed to start:", err);
  });

export default app;
