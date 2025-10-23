import { redisClient } from "../utils/redisClient.js";

export const attachRedis = (req, res, next) => {
  req.redisClient = redisClient;
  next();
};
