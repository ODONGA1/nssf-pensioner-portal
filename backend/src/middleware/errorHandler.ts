import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";

export interface AppError extends Error {
  statusCode: number;
  isOperational: boolean;
  code?: string;
}

export const createError = (
  message: string,
  statusCode: number = 500,
  code?: string
): AppError => {
  const error = new Error(message) as AppError;
  error.statusCode = statusCode;
  error.isOperational = true;
  error.code = code;
  return error;
};

export const errorHandler = (
  error: AppError | Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Set default values
  let statusCode = 500;
  let message = "Internal Server Error";
  let code = "INTERNAL_ERROR";

  // Handle known error types
  if ("statusCode" in error && error.statusCode) {
    statusCode = error.statusCode;
    message = error.message;
    code = error.code || "APPLICATION_ERROR";
  }

  // Handle Prisma errors
  if (error.name === "PrismaClientKnownRequestError") {
    const prismaError = error as any;
    switch (prismaError.code) {
      case "P2002":
        statusCode = 409;
        message = "Duplicate entry detected";
        code = "DUPLICATE_ENTRY";
        break;
      case "P2025":
        statusCode = 404;
        message = "Record not found";
        code = "RECORD_NOT_FOUND";
        break;
      case "P2003":
        statusCode = 400;
        message = "Foreign key constraint failed";
        code = "CONSTRAINT_VIOLATION";
        break;
      default:
        statusCode = 400;
        message = "Database operation failed";
        code = "DATABASE_ERROR";
    }
  }

  // Handle validation errors
  if (error.name === "ValidationError") {
    statusCode = 400;
    message = error.message;
    code = "VALIDATION_ERROR";
  }

  // Handle JWT errors
  if (error.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
    code = "INVALID_TOKEN";
  }

  if (error.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired";
    code = "TOKEN_EXPIRED";
  }

  // Log error details
  logger.error("Error occurred:", {
    message: error.message,
    stack: error.stack,
    statusCode,
    code,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.get("User-Agent"),
    userId: (req as any).user?.id,
  });

  // Prepare response
  const errorResponse: any = {
    success: false,
    message,
    error: {
      code,
      timestamp: new Date().toISOString(),
      path: req.originalUrl,
      method: req.method,
    },
  };

  // Include stack trace in development
  if (process.env.NODE_ENV === "development") {
    errorResponse.error.stack = error.stack;
    errorResponse.error.details = error.message;
  }

  // Include request ID if available
  if ((req as any).requestId) {
    errorResponse.error.requestId = (req as any).requestId;
  }

  res.status(statusCode).json(errorResponse);
};

// Async error wrapper
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// 404 handler
export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    error: {
      code: "ROUTE_NOT_FOUND",
      path: req.originalUrl,
      method: req.method,
      timestamp: new Date().toISOString(),
    },
  });
};

export default errorHandler;
