import { logger } from "../utils/logger.js";
import { Media } from "../models/Media.js";
import { uploadMediaToCloudinary } from "../utils/cloudinary.js";

export const uploadMedia = async (req, res) => {
  logger.info("Starting media upload");
  try {
    console.log(req.file, "req.filereq.file");

    if (!req.file) {
      logger.error("No file found. Please add a file and try again!");
      return res.status(400).json({
        success: false,
        message: "No file found. Please add a file and try again!",
      });
    }

    const { originalname, mimetype } = req.file;
    const userId = req.user.userId;

    logger.info(`File details: name=${originalname}, type=${mimetype}`);
    logger.info("Uploading to cloudinary starting...");

    const cloudinaryUploadResult = await uploadMediaToCloudinary(req.file);
    logger.info(
      `Cloudinary upload successfully. Public Id: - ${cloudinaryUploadResult.public_id}`
    );

    const newlyCreatedMedia = new Media({
      publicId: cloudinaryUploadResult.public_id,
      originalName: originalname,
      MimeType: mimetype,
      url: cloudinaryUploadResult.secure_url,
      userId,
    });

    await newlyCreatedMedia.save();

    res.status(201).json({
      success: true,
      mediaId: newlyCreatedMedia._id,
      url: newlyCreatedMedia.url,
      message: "Media upload is successfully",
    });
  } catch (error) {
    console.log(error);
    logger.error("Error creating media", error);
    res.status(500).json({
      success: false,
      message: "Error creating media",
    });
  }
};

export const getAllMedia = async (req, res) => {
  try {
    const result = await Media.find({ userId: req.user.userId });

    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Cann't find any media for this user",
      });
    }
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (e) {
    logger.error("Error fetching medias", e);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
