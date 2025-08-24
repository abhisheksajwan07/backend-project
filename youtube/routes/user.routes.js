import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import logger from "../config/logger.js";
import jwt from "jsonwebtoken";

import User from "../models/user.model.js";
import cloudinary from "../config/cloudinary.js";
import { upload } from "../config/multer.js";

const router = express.Router();

router.post("/signup", upload.single("logo"), async (req, res) => {
  try {
    // console.log("Hit signup route");
    // console.log("Body:", req.body);
    // console.log("Files:", req.file);

    logger.info(`Signup request for phone: ${req.body.phone}`);

    const { channelName, phone, password, email } = req.body;

    if (!channelName || !phone || !password || !req.file) {
      logger.warn("Missing fields in signup request");
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({
      $or: [{ phone }, { email }],
    });
    if (existingUser) {
      logger.warn(`User already exists: ${phone}`);
      return res.status(409).json({ message: "User already exists" });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const uploadImage = await cloudinary.uploader.upload(req.file.path);

    const newUser = new User({
      _id: new mongoose.Types.ObjectId(),
      channelName,
      phone,
      email,
      password: hashPassword,
      logoId: uploadImage.public_id, // Future me delete/update karne ke liye kaam aayega
      logoUrl: uploadImage.secure_url, // frontend me image display karne ke liye use hota hai
    });

    const savedUser = await newUser.save();
    // console.log(savedUser);
    const { password: _, ...userData } = savedUser.toObject();

    logger.info(`User created successfully: ${phone}`);
    return res.status(201).json({
      message: "Signup successful",
      user: userData,
    });
  } catch (err) {
    logger.error(`Signup error: ${err.message}`);
    return res
      .status(500)
      .json({ message: "Something went wrong", error: err.message });
  }
});

export default router;

router.post("/login", async (req, res) => {
  try {
    console.log("body", req.body);
    const { identifier, password } = req.body;

    const existingUser = await User.findOne({
      $or: [{ email: identifier }, { phone: identifier }],
    });

    if (!existingUser) {
      logger.warn(`User not found : ${identifier}`);
      return res.status(404).json({ message: "User not found" });
    }

    const isValid = await bcrypt.compare(password, existingUser.password);
    if (!isValid) {
      logger.warn(`Invalid login attempt for ${identifier}`);
      return res.status(401).json({
        message: "invalid credentials",
      });
    }

    const { password: _, ...userData } = existingUser.toObject();

    const payload = {
      _id: userData._id,
      channelName: userData.channelName,
      email: userData.email,
      phone: userData.phone,
      logoId: userData.logoId,
    };
    const token = jwt.sign(payload, process.env.JWT_TOKEN, { expiresIn: "1d" });

    logger.info(`User logged in ${identifier}`);

    res.status(200).json({
      ...payload,
      logoUrl: userData.logoUrl,
      token,
      subscribers: userData.subscribers,
      subscribedChannels: userData.subscribedChannels,
    });
  } catch (err) {
    console.log(err);
    logger.error(`Login error: ${err.message}`);
    res
      .status(500)
      .json({ message: "Something went wrong", error: err.message });
  }
});

// Login route → JSON POST
// Signup route → form-data / Multer
