import { createClient } from "redis";
import { logger } from "./logger";

let redisClient: ReturnType<typeof createClient> | null = null;

export const connectRedis = async () => {
  if (!process.env.REDIS_HOST) {
    logger.warn("Redis configuration not found, skipping Redis connection");
    return null;
  }

  try {
    redisClient = createClient({
      socket: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT || "6379"),
      },
      password: process.env.REDIS_PASSWORD || undefined,
      database: parseInt(process.env.REDIS_DB || "0"),
    });

    redisClient.on("error", (err) => {
      logger.error("Redis Client Error:", err);
    });

    redisClient.on("connect", () => {
      logger.info("Connected to Redis");
    });

    redisClient.on("ready", () => {
      logger.info("Redis client ready");
    });

    redisClient.on("end", () => {
      logger.info("Redis connection ended");
    });

    await redisClient.connect();
    return redisClient;
  } catch (error) {
    logger.error("Failed to connect to Redis:", error);
    return null;
  }
};

export const getRedisClient = () => redisClient;

export const disconnectRedis = async () => {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
  }
};

// Redis utility functions
export const redisUtils = {
  // Session management
  setSession: async (sessionId: string, data: any, ttl: number = 3600) => {
    if (!redisClient) return false;
    try {
      await redisClient.setEx(
        `session:${sessionId}`,
        ttl,
        JSON.stringify(data)
      );
      return true;
    } catch (error) {
      logger.error("Redis setSession error:", error);
      return false;
    }
  },

  getSession: async (sessionId: string) => {
    if (!redisClient) return null;
    try {
      const data = await redisClient.get(`session:${sessionId}`);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      logger.error("Redis getSession error:", error);
      return null;
    }
  },

  deleteSession: async (sessionId: string) => {
    if (!redisClient) return false;
    try {
      await redisClient.del(`session:${sessionId}`);
      return true;
    } catch (error) {
      logger.error("Redis deleteSession error:", error);
      return false;
    }
  },

  // Cache management
  setCache: async (key: string, data: any, ttl: number = 300) => {
    if (!redisClient) return false;
    try {
      await redisClient.setEx(`cache:${key}`, ttl, JSON.stringify(data));
      return true;
    } catch (error) {
      logger.error("Redis setCache error:", error);
      return false;
    }
  },

  getCache: async (key: string) => {
    if (!redisClient) return null;
    try {
      const data = await redisClient.get(`cache:${key}`);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      logger.error("Redis getCache error:", error);
      return null;
    }
  },

  deleteCache: async (key: string) => {
    if (!redisClient) return false;
    try {
      await redisClient.del(`cache:${key}`);
      return true;
    } catch (error) {
      logger.error("Redis deleteCache error:", error);
      return false;
    }
  },

  // Rate limiting
  incrementRateLimit: async (identifier: string, window: number = 900) => {
    if (!redisClient) return { count: 0, ttl: 0 };
    try {
      const key = `rate_limit:${identifier}`;
      const multi = redisClient.multi();
      multi.incr(key);
      multi.expire(key, window);
      const results = await multi.exec();
      const count = (results?.[0] as number) || 0;
      const ttl = await redisClient.ttl(key);
      return { count, ttl };
    } catch (error) {
      logger.error("Redis incrementRateLimit error:", error);
      return { count: 0, ttl: 0 };
    }
  },
};

export default redisClient;
