import express from "express";
import { authenticateRequest } from "../middleware/authMiddleware.js";
import { handleUpload } from "../middleware/multer.js";

import { getAllMedia, uploadMedia } from "../controller/media.controller.js";
import {
  flexibleLimiter,
  limiterMiddleware,
  sensitiveLimiter,
} from "../middleware/rateLimiter.js";

export const router = express.Router();

router.post(
  "/upload",
  authenticateRequest,
  limiterMiddleware(sensitiveLimiter),
  handleUpload,
  uploadMedia
);

router.get(
  "/get",
  authenticateRequest,
  limiterMiddleware(flexibleLimiter),
  getAllMedia
);
