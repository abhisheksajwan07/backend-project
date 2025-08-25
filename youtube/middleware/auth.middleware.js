import jwt from "jsonwebtoken";
import logger from "../config/logger";

export const checkAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split("")[1];
    if (!token) {
      return res.status(401).json({
        error: "no token is provided",
      });
    }
    const decodedUser = jwt.verify(token, process.env.JWT_TOKEN);
    req.user = decodedUser;
    next();
  } catch (err) {
    logger.error(`Login error: ${err.message}`);
    res.status(500).json({
      error: "something went wrong",
      message: err.message,
    });
  }
};
