import express from "express";
import { config } from "dotenv";
import cors from "cors";
import helmet from "helmet";
import { RateLimiterRedis } from "rate-limiter-flexible";
import Redis from "ioredis";

import { ConnectDb } from "./config/db.config.js";
import { logger } from "./utils/logger.js";

import { router } from "./routes/identity.routes.js";
import { errorHandler } from "./middleware/errorhandler.js";

config();
const app = express();
ConnectDb();

const PORT = process.env.PORT;
const redisClient = new Redis(process.env.REDIS_URL);
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//ddos

const rateLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: "middleware",
  points: 10, // max 10 req allowoed
  duration: 1, // 1 ip can send max 10req per sec
});

// this ip will be used a s key which is my curent ip
// it will return a promise if the rate limit not exceed it call next()
// but it exceed it will go to the catch block
app.use((req, res, next) => {
  rateLimiter
    .consume(req.ip)
    .then(() => next())
    .catch(() => {
      logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
      res.status(429).json({ success: false, message: "Too many requests" });
    });
});

//logs req.
app.use((req, res, next) => {
  logger.info(`received ${req.method} request to ${req.url}`);
  logger.info(`request body ${req.body} `);
  next();
});

//routes
app.use("/api/auth", router);

// error
app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`indentity service runnning on port ${PORT}`);
});

process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Rejection at", promise, "reason:", reason);
});
