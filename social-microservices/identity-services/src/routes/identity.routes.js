// routes/identity.routes.js
import express from "express";
import { loginUser, logoutUser, refreshTokenUser, registerUser } from "../controller/identity.controller.js";
import { sensitiveEndpointsLimiter } from "../middleware/rateLimiter.js";

export const router = express.Router();

router.post("/register", sensitiveEndpointsLimiter, registerUser);
router.post("/login", loginUser);
router.post("/refresh-token",refreshTokenUser)
router.post("/logout",logoutUser)