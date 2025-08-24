import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import cloudinary from "../config/cloudinary.js";
import { upload } from "../config/multer.js";
import logger from "../config/logger.js";

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
      logoId: uploadImage.public_id,
      logoUrl: uploadImage.secure_url,
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
