import cors from "cors";

import express from "express";
import helmet from "helmet";

import { logger } from "./utils/logger.js";

import { errorHandler } from "./middleware/errorHandler.js";
import { validateToken } from "./middleware/authMiddleware.js";

import {
  PORT,
  IDENTITY_SERVICE_URL,
  POST_SERVICE_URL,
  MEDIA_SERVICE_URL,
  SEARCH_SERVICE_URL,
} from "./config/index.js";
import { rateLimitMiddleware } from "./config/rateLimiter.js";
import { createProxy } from "./utils/proxyFactory.js";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json()); // req. mai data json string mai jaata express json string nahi samjhta
// to yeh use krte -> express automatic fir usko parse karke hame readble format mai bejta
app.use(rateLimitMiddleware);

// simple request logger (stringify body to avoid [Object object])
app.use((req, res, next) => {
  logger.info(`received ${req.method} request to ${req.url}`);
  logger.info(`Request body, ${JSON.stringify(req.body)}`);
  next();
});

// proxy for identity service
// only three services are there?
// api-gateway -> /v1/auth/register ->3000
//identity->/api/auth/register -> 3001

//lcl/3000/v1/auth/register -> lcl:3001/api/auth/regisetr

app.use(
  "/v1/auth",
  createProxy(IDENTITY_SERVICE_URL, {
    proxyReqOptDecorator: (proxyReqOpts, scrReq) => {
      proxyReqOpts.headers["Content-Type"] = "application/json";
      return proxyReqOpts;
    },
    userResDecorator: (proxyRes, proxyResData, userReq, userRes) => {
      logger.info(
        `Response received from identity service:${proxyRes.statusCode}`
      );
      return proxyResData;
    },
  })
);

//setting up proxy for our post service
app.use(
  "/v1/posts",
  validateToken,
  createProxy(POST_SERVICE_URL, {
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
      console.log(
        "Proxying request to:",
        process.env.POST_SERVICE_URL + srcReq.originalUrl
      );
      proxyReqOpts.headers["Content-Type"] = "application/json";
      proxyReqOpts.headers["x-user-id"] = srcReq.user.userId;
      return proxyReqOpts;
    },
    userResDecorator: (proxyRes, proxyResData, userReq, userRes) => {
      logger.info(`Response received from Post service:${proxyRes.statusCode}`);
      return proxyResData;
    },
  })
);

app.use(
  "/v1/media",
  validateToken,
  createProxy(MEDIA_SERVICE_URL, {
    parseReqBody: false,
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
      proxyReqOpts.headers["x-user-id"] = srcReq.user?.userId;
      const ct = srcReq.headers["content-type"] || "";
      if (!ct.startsWith("multipart/form-data")) {
        proxyReqOpts.headers["Content-Type"] = "application/json";
      }
      return proxyReqOpts;
    },
    userResDecorator: (proxyRes, proxyResData, userReq, userRes) => {
      logger.info(
        `Response received from media service: ${proxyRes.statusCode}`
      );
      console.log("req received proxy ");
      return proxyResData;
    },
  })
);

//setting up proxy for our search service
app.use(
  "/v1/search",
  validateToken,
  createProxy(SEARCH_SERVICE_URL, {
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
      proxyReqOpts.headers["Content-Type"] = "application/json";
      proxyReqOpts.headers["x-user-id"] = srcReq.user?.userId;
      return proxyReqOpts;
    },
    userResDecorator: (proxyRes, proxyResData, userReq, userRes) => {
      logger.info(`Response received from Search service: ${proxyRes.statusCode}`);
      return proxyResData;
    },
  })
);

app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`API gateway running on port:${PORT}`);
  logger.info(
    `Identity service is running on port ${process.env.IDENTITY_SERVICE_URL}`
  );
  logger.info(
    `Post service is running on port ${process.env.POST_SERVICE_URL}`
  );
  logger.info(
    `media service is running on port ${process.env.MEDIA_SERVICE_URL}`
  );
  logger.info(
    `Search service is running on port ${process.env.SEARCH_SERVICE_URL}`
  );
  logger.info(`Redis Url ${process.env.REDIS_URL}`);
});
