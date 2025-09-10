import mongoose from "mongoose";
import { logger } from "../utils/logger.js";
export const ConnectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    logger.info("db connected ");
  } catch (err) {
    logger.warn(err.message);
  }
};
