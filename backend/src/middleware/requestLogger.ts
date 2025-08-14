import { Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";
import { logger } from "../utils/logger";
import { RequestWithId } from "../types/express";

export const requestLogger = (
  req: RequestWithId,
  res: Response,
  next: NextFunction
): void => {
  // Generate unique request ID
  req.id = uuidv4();

  // Capture start time
  const startTime = Date.now();

  // Log incoming request
  logger.info("Incoming request", {
    requestId: req.id,
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.get("User-Agent"),
    timestamp: new Date().toISOString(),
  });

  // Override res.json to log response
  const originalJson = res.json;
  res.json = function (body: any) {
    const duration = Date.now() - startTime;

    logger.info("Response sent", {
      requestId: req.id,
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      responseSize: JSON.stringify(body).length,
    });

    return originalJson.call(this, body);
  };

  // Override res.send to log response
  const originalSend = res.send;
  res.send = function (body: any) {
    const duration = Date.now() - startTime;

    logger.info("Response sent", {
      requestId: req.id,
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      responseSize:
        typeof body === "string" ? body.length : JSON.stringify(body).length,
    });

    return originalSend.call(this, body);
  };

  next();
};

export default requestLogger;
