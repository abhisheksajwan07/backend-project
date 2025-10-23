import express from "express";
import { config } from "dotenv";
import cors from "cors";
import helmet from "helmet";
import { logger } from "./utils/logger.js";

import { router } from "./routes/media.routes.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { ConnectDb } from "./config/db.js";
import { attachRedis } from "./middleware/attachRedis.js";
import { connectToRabbitMQ, consumeEvent } from "./utils/rabbitmq.js";
import { handlePostDeleted } from "./eventHandlers/media-event-handler.js";

config();
const app = express();
const PORT = process.env.PORT || 3003;

ConnectDb();

app.use(helmet());
app.use(cors());
app.use(express.json());

//logs req.
app.use((req, res, next) => {
  logger.info(`received ${req.method} request to ${req.url}`);
  logger.info(`request body ${req.body} `);
  next();
});

app.use(attachRedis);
//routes
app.use("/api/media", router);

// error
app.use(errorHandler);

async function startServer() {
  try {
    await connectToRabbitMQ();

    //consume all the events
    await consumeEvent("post.deleted", handlePostDeleted);

    app.listen(PORT, () => {
      logger.info(`Media service running on port ${PORT}`);
    });
  } catch (error) {
    logger.error("Failed to connect to server", error);
    // process.exit(1);
  }
}

startServer();

process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Rejection at", promise, "reason:", reason);
});
