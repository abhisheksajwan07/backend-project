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
        tags: tags ? tags.split(",").map((t) => t.trim()) : [],
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

router.put(
  "/update/:id",
  checkAuth,
  upload.fields([
    { name: "video", maxCount: 1 },
    {
      name: "thumbnail",
      maxCount: 1,
    },
  ]),
  async (req, res) => {
    try {
      const { title, description, tags, category } = req.body;
      const videoIdParam = req.params.id;

      const video = await Video.findById(videoIdParam);
      if (!video) {
        logger.warn(`Video not found:${videoIdParam}`);
        return res.status(404).json({ error: "Video not found" });
      }

      if (video.user_id.toString() !== req.user._id.toString()) {
        logger.warn(`Unauthorized update attempt by user: ${req.user._id}`);
        return res.status(403).json({ error: "Unauthorized" });
      }

      // replace thumbnail if uploaded

      if (req.files || req.files.thumbnail) {
        const thumbnailFile = req.files.thumbnail[0];

        if (video.thumbnailId) {
          await cloudinary.uploader.destroy(video.thumbnailId);
        }

        const thumbnailUpload = await cloudinary.uploader.upload(
          thumbnailFile.path,
          {
            folder: "thumbnails",
          }
        );

        video.thumbnailId = thumbnailUpload.public_id;
        video.thumbnailUrl = thumbnailUpload.secure_url;

        //cleanup temp
        fs.unlinkSync(thumbnailFile.path);

        logger.info(`Thumbnail updated for video: ${videoIdParam}`);
      }

      //replace video if uploaded
      if (req.files && req.files.video) {
        const videoFile = req.files.video[0];
        if (video.videoId) {
          await cloudinary.uploader.destroy(video.videoId, {
            resource_type: "video",
          });
        }
        //upload new video
        const videoUpload = await cloudinary.uploader.upload(videoFile.path, {
          resource_type: "video",
          folder: "videos",
        });
        video.videoUrl = videoUpload.secure_url;
        video.videoId = videoUpload.public_id;

        fs.unlinkSync(videoFile.path);

        logger.info(`Video file updated for video: ${videoIdParam}`);
      }

      //metadata updation
      video.title = title || video.title;
      video.description = description || video.description;
      video.category = category || video.category;
      video.tags = tags ? tags.split(",").map((tag) => tag.trim()) : video.tags;

      await video.save();

      // remove internal ids
      const { videoId: _, thumbnailId: _, ...safeVideo } = video.toObject();

      logger.info(`Video metadata updated successfully: ${videoIdParam}`);
      res
        .status(200)
        .json({ message: "Video updated successfully", video: safeVideo });
    } catch (err) {
      logger.error(`Video update failed: ${err.message}`);
      res
        .status(500)
        .json({ error: "Something went wrong", message: err.message });
    }
  }
);

export default router;
