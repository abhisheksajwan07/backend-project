import { config } from "dotenv";
import express from "express";

import cors from "cors";
import helmet from "helmet";
import { errorHandler } from "./middleware/errorHandler.js";
import { logger } from "./utils/logger.js";
import { connectToRabbitMQ, consumeEvent } from "./utils/rabbitmq.js";
import { router } from "./routes/search.routes.js";
import {
  handlePostCreated,
  handlePostDeleted,
} from "./eventHandlers/search-event-handlers.js";

config();
const app = express();
const PORT = process.env.PORT || 3004;

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
app.use("/api/search", router);

// error
app.use(errorHandler);

async function startServer() {
  try {
    await connectToRabbitMQ();

    //consume the events / subscribe to the events
    await consumeEvent("post.created", handlePostCreated);
    await consumeEvent("post.deleted", handlePostDeleted);

    app.listen(PORT, () => {
      logger.info(`Search service is running on port: ${PORT}`);
    });
  } catch (e) {
    logger.error(e, "Failed to start search service");
    process.exit(1);
  }
}

startServer();
