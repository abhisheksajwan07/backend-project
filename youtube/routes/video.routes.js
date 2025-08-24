import express from "express";
import mongoose from "mongoose";

import logger from "../config/logger.js";
import jwt from "jsonwebtoken";

import User from "../models/user.model.js";
import cloudinary from "../config/cloudinary.js";
import { upload } from "../config/multer.js";


const router = express.Router();

export default router