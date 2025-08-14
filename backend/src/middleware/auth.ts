import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { createError } from "./errorHandler";
import { logger } from "../utils/logger";

const prisma = new PrismaClient();

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    username: string;
    role: string;
    pensionerId?: string;
    sessionId?: string;
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
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw createError(
        "JWT secret not configured",
        500,
        "SERVER_CONFIG_ERROR"
      );
    }

    const decoded = jwt.verify(token, jwtSecret) as any;

    // Validate token structure
    if (!decoded.id || !decoded.username || !decoded.role) {
      throw createError("Invalid token structure", 401, "INVALID_TOKEN");
    }

    // Fetch user from database to ensure it's still active
    const user = await prisma.users.findFirst({
      where: {
        user_id: decoded.id,
        is_active: true,
        is_locked: false,
      },
      include: {
        pensioners: true,
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

    // Attach user info to request
    req.user = {
      id: user.user_id,
      username: user.username,
      role: user.role,
      pensionerId: user.pensioner_id || undefined,
      sessionId: decoded.sessionId,
    };

    // Log successful authentication
    logger.info("User authenticated", {
      userId: user.user_id,
      username: user.username,
      role: user.role,
      ip: req.ip,
      userAgent: req.get("User-Agent"),
    });

    next();
  } catch (error: any) {
    if (error.name === "JsonWebTokenError") {
      next(createError("Invalid token", 401, "INVALID_TOKEN"));
    } else if (error.name === "TokenExpiredError") {
      next(createError("Token expired", 401, "TOKEN_EXPIRED"));
    } else {
      next(error);
    }
  }
};

// Role-based authorization middleware
export const authorize = (...roles: string[]) => {
  return (
    req: AuthenticatedRequest,
    _res: Response,
    next: NextFunction
  ): void => {
    if (!req.user) {
      next(createError("Authentication required", 401, "AUTH_REQUIRED"));
      return;
    }

    if (!roles.includes(req.user.role)) {
      logger.warn("Unauthorized access attempt", {
        userId: req.user.id,
        requiredRoles: roles,
        userRole: req.user.role,
        path: req.originalUrl,
      });
      next(
        createError("Insufficient permissions", 403, "INSUFFICIENT_PERMISSIONS")
      );
      return;
    }

    next();
  };
};

// Pensioner-specific authorization (users can only access their own data)
export const authorizePensioner = (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    next(createError("Authentication required", 401, "AUTH_REQUIRED"));
    return;
  }

  // Admins and support staff can access any pensioner data
  if (req.user.role === "ADMIN" || req.user.role === "SUPPORT_STAFF") {
    next();
    return;
  }

  // For pensioners, check if they're accessing their own data
  if (req.user.role === "PENSIONER") {
    const pensionerId =
      req.params.pensionerId || req.body.pensionerId || req.query.pensionerId;

    if (pensionerId && pensionerId !== req.user.pensionerId) {
      logger.warn("Pensioner attempted to access another pensioner's data", {
        userId: req.user.id,
        attemptedPensionerId: pensionerId,
        userPensionerId: req.user.pensionerId,
      });
      next(
        createError(
          "Access denied to other pensioner data",
          403,
          "ACCESS_DENIED"
        )
      );
      return;
    }
  }

  next();
};

// Optional authentication middleware (for public endpoints that benefit from user context)
export const optionalAuth = async (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      next();
      return;
    }

    const token = authHeader.substring(7);
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      next();
      return;
    }

    const decoded = jwt.verify(token, jwtSecret) as any;

    const user = await prisma.users.findFirst({
      where: {
        user_id: decoded.id,
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
  } catch (error: any) {
    // Silently fail for optional authentication
    logger.debug("Optional authentication failed", { error: error.message });
  }

  next();
};

export default authMiddleware;
