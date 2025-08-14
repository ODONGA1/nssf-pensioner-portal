import winston from "winston";
import path from "path";

const { combine, timestamp, errors, json, colorize, printf } = winston.format;

// Custom format for console output
const consoleFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level.toUpperCase()}]: ${stack || message}`;
});

// Create logs directory path
const logDir = process.env.LOG_FILE_PATH || "./logs";

// Winston logger configuration
export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: combine(
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    errors({ stack: true }),
    json()
  ),
  defaultMeta: { service: "nssf-pensioner-api" },
  transports: [
    // Write all logs to file
    new winston.transports.File({
      filename: path.join(logDir, "error.log"),
      level: "error",
      maxsize: 10485760, // 10MB
      maxFiles: 5,
    }),
    new winston.transports.File({
      filename: path.join(logDir, "combined.log"),
      maxsize: 10485760, // 10MB
      maxFiles: 5,
    }),
  ],
});

// Add console transport in development
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: combine(
        colorize(),
        timestamp({ format: "HH:mm:ss" }),
        consoleFormat
      ),
    })
  );
}

// Create application-specific log methods
export const loggers = {
  auth: logger.child({ module: "auth" }),
  pensioner: logger.child({ module: "pensioner" }),
  payment: logger.child({ module: "payment" }),
  security: logger.child({ module: "security" }),
  audit: logger.child({ module: "audit" }),
  database: logger.child({ module: "database" }),
};

export default logger;
