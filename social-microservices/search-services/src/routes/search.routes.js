import express from "express";
import { searchPostController } from "../controller/search-controller.js";
import { authenticateRequest } from "../middleware/authMiddleware.js";

export const router = express.Router();

router.get("/posts",authenticateRequest, searchPostController);
