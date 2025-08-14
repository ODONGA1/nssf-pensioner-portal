import express, { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import slowDown from "express-slow-down";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

// Import routes
import authRoutes from "./routes/auth";
import pensionerRoutes from "./routes/pensioner";
import benefitRoutes from "./routes/benefit";
import paymentRoutes from "./routes/payment";
import documentRoutes from "./routes/document";
import messageRoutes from "./routes/message";
import notificationRoutes from "./routes/notification";
import adminRoutes from "./routes/admin";

// Import middleware
import { errorHandler } from "./middleware/errorHandler";
import { requestLogger } from "./middleware/requestLogger";
import { authMiddleware } from "./middleware/auth";

// Import utils
import { logger } from "./utils/logger";
import { connectRedis } from "./utils/redis";

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;
const API_VERSION = process.env.API_VERSION || "v1";

// Initialize Prisma Client
export const prisma = new PrismaClient({
  log:
    process.env.NODE_ENV === "development"
      ? ["query", "info", "warn", "error"]
      : ["warn", "error"],
});

// Security middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
  })
);

// CORS configuration
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

// Compression middleware
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000"), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "100"), // limit each IP to 100 requests per windowMs
  message: {
    error: "Too many requests from this IP, please try again later.",
    code: "RATE_LIMIT_EXCEEDED",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Speed limiter for additional protection
const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 50, // allow 50 requests per 15 minutes, then...
  delayMs: 500, // begin adding 500ms of delay per request above 50
});

app.use(limiter);
app.use(speedLimiter);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Request logging
app.use(requestLogger as any);

// Health check endpoint
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || "1.0.0",
    environment: process.env.NODE_ENV || "development",
  });
});

// API documentation endpoint
app.get("/api-docs", (_req: Request, res: Response) => {
  res.json({
    name: "NSSF Pensioner Self-Service Portal API",
    version: "1.0.0",
    description: "REST API for NSSF Pensioner Self-Service Portal",
    endpoints: {
      auth: `/api/${API_VERSION}/auth`,
      pensioner: `/api/${API_VERSION}/pensioner`,
      benefits: `/api/${API_VERSION}/benefits`,
      payments: `/api/${API_VERSION}/payments`,
      documents: `/api/${API_VERSION}/documents`,
      messages: `/api/${API_VERSION}/messages`,
      notifications: `/api/${API_VERSION}/notifications`,
      admin: `/api/${API_VERSION}/admin`,
    },
    documentation: "https://docs.nssfug.org/api",
    support: "customerservice@nssfug.org",
  });
});

// API Routes
app.use(`/api/${API_VERSION}/auth`, authRoutes);
app.use(
  `/api/${API_VERSION}/pensioner`,
  authMiddleware as any,
  pensionerRoutes
);
app.use(`/api/${API_VERSION}/benefits`, authMiddleware as any, benefitRoutes);
app.use(`/api/${API_VERSION}/payments`, authMiddleware as any, paymentRoutes);
app.use(`/api/${API_VERSION}/documents`, authMiddleware as any, documentRoutes);
app.use(`/api/${API_VERSION}/messages`, authMiddleware as any, messageRoutes);
app.use(
  `/api/${API_VERSION}/notifications`,
  authMiddleware as any,
  notificationRoutes
);
app.use(`/api/${API_VERSION}/admin`, authMiddleware as any, adminRoutes);

// 404 handler for undefined routes
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    error: {
      code: "ROUTE_NOT_FOUND",
      path: req.originalUrl,
      method: req.method,
    },
  });
});

// Global error handler
app.use(errorHandler);

// Graceful shutdown function
const gracefulShutdown = async (signal: string) => {
  logger.info(`Received ${signal}. Starting graceful shutdown...`);

  try {
    // Close database connection
    await prisma.$disconnect();
    logger.info("Database connection closed");

    // Close Redis connection if applicable
    // await redisClient.quit();

    logger.info("Graceful shutdown completed");
    process.exit(0);
  } catch (error) {
    logger.error("Error during graceful shutdown:", error);
    process.exit(1);
  }
};

// Handle shutdown signals
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  logger.error("Uncaught Exception:", error);
  gracefulShutdown("uncaughtException");
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Rejection at:", promise, "reason:", reason);
  gracefulShutdown("unhandledRejection");
});

// Start server
const startServer = async () => {
  try {
    // Test database connection
    await prisma.$connect();
    logger.info("Connected to PostgreSQL database");

    // Connect to Redis if configured
    if (process.env.REDIS_HOST) {
      await connectRedis();
      logger.info("Connected to Redis");
    }

    // Start HTTP server
    app.listen(PORT, () => {
      logger.info(
        `🚀 NSSF Pensioner Portal API server running on port ${PORT}`
      );
      logger.info(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
      logger.info(`🏥 Health Check: http://localhost:${PORT}/health`);
      logger.info(`🔧 Environment: ${process.env.NODE_ENV || "development"}`);
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
};

// Start the server
startServer();

export default app;
