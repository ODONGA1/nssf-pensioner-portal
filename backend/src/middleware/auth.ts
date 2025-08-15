import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { createError } from "./errorHandler";

const prisma = new PrismaClient();

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    username: string;
    role: string;
    pensionerId?: string;
  };
}

export const authMiddleware = async (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw createError("Access token required", 401, "TOKEN_REQUIRED");
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify JWT token
    const jwtSecret =
      process.env.JWT_SECRET ||
      "your-super-secret-jwt-key-change-in-production";

    const decoded = jwt.verify(token, jwtSecret) as any;

    // Validate token structure
    if (!decoded.userId || !decoded.username || !decoded.role) {
      throw createError("Invalid token structure", 401, "INVALID_TOKEN");
    }

    // Fetch user from database to ensure it's still active
    const user = await prisma.users.findFirst({
      where: {
        user_id: decoded.userId,
        is_active: true,
        is_locked: false,
      },
    });

    if (!user) {
      throw createError("User not found or inactive", 401, "USER_INACTIVE");
    }

    // Check if password was changed after token was issued
    const tokenIssuedAt = new Date(decoded.iat * 1000);
    if (
      user.password_last_changed &&
      user.password_last_changed > tokenIssuedAt
    ) {
      throw createError(
        "Token invalid due to password change",
        401,
        "TOKEN_INVALIDATED"
      );
    }

    // Add user info to request object
    req.user = {
      id: user.user_id,
      username: user.username,
      role: user.role,
      pensionerId: user.pensioner_id || undefined,
    };

    next();
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      next(createError("Token expired", 401, "TOKEN_EXPIRED"));
    } else if (error.name === "JsonWebTokenError") {
      next(createError("Invalid token", 401, "INVALID_TOKEN"));
    } else {
      next(error);
    }
  }
};

// Role-based authorization middleware
export const requireRole = (roles: string | string[]) => {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(
        createError("Authentication required", 401, "NOT_AUTHENTICATED")
      );
    }

    const allowedRoles = Array.isArray(roles) ? roles : [roles];
    if (!allowedRoles.includes(req.user.role)) {
      return next(
        createError("Insufficient permissions", 403, "INSUFFICIENT_PERMISSIONS")
      );
    }

    next();
  };
};

// Optional auth middleware - doesn't throw error if no token
export const optionalAuthMiddleware = async (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(); // Continue without authentication
    }

    const token = authHeader.substring(7);
    const jwtSecret =
      process.env.JWT_SECRET ||
      "your-super-secret-jwt-key-change-in-production";

    const decoded = jwt.verify(token, jwtSecret) as any;

    if (decoded.userId) {
      const user = await prisma.users.findFirst({
        where: {
          user_id: decoded.userId,
          is_active: true,
          is_locked: false,
        },
      });

      if (user) {
        req.user = {
          id: user.user_id,
          username: user.username,
          role: user.role,
          pensionerId: user.pensioner_id || undefined,
        };
      }
    }

    next();
  } catch (error) {
    // Continue without authentication if token is invalid
    next();
  }
};

export default authMiddleware;
