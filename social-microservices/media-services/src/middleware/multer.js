import multer from "multer";
import {logger} from "../utils/logger.js";

const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
}).single("file");

// Middleware to handle errors and file presence
export const handleUpload = (req, res, next) => {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      logger.error("Multer error while uploading:", err);
      return res.status(400).json({
        message: "Multer error while uploading",
        error: err.message,
        stack: err.stack,
      });
    } else if (err) {
      logger.error("Unknown error occurred while uploading:", err);
      return res.status(500).json({
        message: "Unknown error occurred while uploading",
        error: err.message,
        stack: err.stack,
      });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file found!" });
    }

    next();
  });
};
