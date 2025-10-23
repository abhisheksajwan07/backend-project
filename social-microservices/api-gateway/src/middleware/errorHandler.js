import {logger} from "../utils/logger.js";

export const errorHandler = (err, req, res, next) => {
  logger.error(err.stack);
  console.log(err)

  res.status(err.status || 500).json({
    message: err.message || "internal error ",
  });
};
