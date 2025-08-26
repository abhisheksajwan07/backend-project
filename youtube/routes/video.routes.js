import express from "express";
import mongoose, { Mongoose } from "mongoose";

import logger from "../config/logger.js";
import jwt from "jsonwebtoken";

import User from "../models/user.model.js";
import Video from "../models/video.model.js";
import cloudinary from "../config/cloudinary.js";
import { upload } from "../config/multer.js";
import { checkAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post(
  "/upload",
  checkAuth,
  upload.fields([
    { name: "videoUrl", maxCount: 1 },
    { name: "thumbnailUrl", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { title, description, tags, category } = req.body;
      if (!req.files || !req.files.videoUrl || !req.files.thumbnailUrl) {
        return res.status(400).json({
          error: "Video and ThumbnailUrl are required",
        });
      }
      const videoPath = req.files.videoUrl[0].path;
      const thumbPath = req.files.thumbnailUrl[0].path;
      const videoUpload = await cloudinary.uploader.upload(videoPath, {
        resource_type: "video",
        folder: "videos",
      });
      const thumbnailUpload = await cloudinary.uploader.upload(thumbPath, {
        folder: "thumbnails",
      });

      const newVideo = await Video({
        _id: new mongoose.Types.ObjectId(),
        title,
        description,
        user_id: req.user._id,
        videoUrl: videoUpload.secure_url,
        videoId: videoUpload.public_id,
        thumbnailUrl: thumbPath.secure_url,
        thumbnailId: thumbPath.public_id,
        category,
        tags: tags ? tags.split(",") : [],
      });

      await newVideo.save();

      res.status(201).json({
        message: "Video Uploaded Successfully",
        video: newVideo,
      });
    } catch (err) {
      console.error(error);
      res.status(500).json({
        error: "Something went wrong",
        message: error.message,
      });
    }
  }
);

export default router;
