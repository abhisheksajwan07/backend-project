import express from "express";

import { authenticateRequest } from "../middleware/authMiddleware.js";
import {
  createPost,
  getAllPosts,
  getPost,
  deletePost,
} from "../controller/post.js";
import {
  flexibleLimiter,
  limiterMiddleware,
  sensitiveLimiter,
} from "../middleware/rateLimiter.js";

export const router = express.Router();

router.post(
  "/create-post",
  authenticateRequest,
  limiterMiddleware(sensitiveLimiter),
  createPost
);

router.get(
  "/all-posts",
  authenticateRequest,
  
  getAllPosts
);

router.get(
  "/:id",
  authenticateRequest,
  limiterMiddleware(flexibleLimiter),
  getPost
);

router.delete(
  "/:id",authenticateRequest,limiterMiddleware(flexibleLimiter),deletePost
);
