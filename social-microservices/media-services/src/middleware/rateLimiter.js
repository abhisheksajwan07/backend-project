import {RateLimiterRedis} from "rate-limiter-flexible";
import { redisClient } from "../utils/redisClient.js";

export const sensitiveLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: "sensitive",
  points: 5, // max 5 requests
  duration: 60, // per 1 minute
});

export const flexibleLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: "flexible",
  points: 50, // max 100 requests
  duration: 60, // per 1 minute
});

export const limiterMiddleware = (limiter) => {
  return async (req, res, next) => {
    try {
      const key = req.ip;
      await limiter.consume(key);
      next();
    } catch (err) {
      logger.warn(`Rate limit exceeded for key: ${req.ip}`);
      res.status(429).json({ success: false, message: "Too many requests" });
    }
  };
};
