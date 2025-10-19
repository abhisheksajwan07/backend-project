// middleware/rateLimiter.middleware.js
import { rateLimit } from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";
import Redis from "ioredis";
import { logger } from "../utils/logger.js";

const redisClient = new Redis(process.env.REDIS_URL);

// ip based rate limit for sesnsitive endpoints

export const sensitiveEndpointsLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50, // max 50 req in 15min
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn(`Sensitive endpoint rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({ success: false, message: "Too many requests" });
  },
  // Ye rate-limit-redis library ki class hai.
  store: new RedisStore({
    sendCommand: (...args) => redisClient.call(...args),
  }),
});
