import express from "express";
import { config } from "dotenv";
import cors from "cors";
import helmet from "helmet";
import { logger } from "./utils/logger.js";

import { router } from "./routes/post-routes.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { ConnectDb } from "./config/db.js";
import { attachRedis } from "./middleware/attachRedis.js";
import { connectToRabbitMQ } from "./utils/rabbitmq.js";

config();
const app = express();
const PORT = process.env.PORT || 3002;

ConnectDb();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//logs req.
app.use((req, res, next) => {
  logger.info(`received ${req.method} request to ${req.url}`);
  logger.info(`request body ${JSON.stringify(req.body)} `);
  next();
});

app.use(attachRedis);
//routes
app.use("/api/posts", router);

// error
app.use(errorHandler);

async function startServer() {
  try {
    await connectToRabbitMQ();
    app.listen(PORT, () => {
      logger.info(`Post service runnning on port ${PORT}`);
    });
  } catch (e) {
    logger.error("falied to connect to  server", e);
    process.exit(1);
  }
}

process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Rejection at", promise, "reason:", reason);
});

startServer();
