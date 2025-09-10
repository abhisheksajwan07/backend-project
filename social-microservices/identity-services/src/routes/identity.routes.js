import express from "express";
import { registerUser } from "../controller/identity.controller.js";
export const router = express.Router();

router.post("/register", registerUser);
