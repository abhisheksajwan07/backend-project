// import cloudinary from "cloudinary";
// import { logger } from "../utils/logger.js";
// import 'dotenv/config'

// cloudinary.config({
//   cloud_name: process.env.CLOUD_NAME,
//   api_key: process.env.API_KEY,
//   api_secret: process.env.API_SECRET,
//   timeout: 60000
// });

// export const uploadMediaToCloudinary = (file) => {
//   return new Promise((resolve, reject) => {
//     const uploadStream = cloudinary.uploader.upload_stream(
//       {
//         resource_type: "auto",
//       },
//       (error, result) => {
//         if (error) {
//           logger.error("Error while uploading media to cloudinary", error);
//           reject(error);
//         } else {
//           resolve(result);
//         }
//       }
//     );

//     uploadStream.end(file.buffer);
//   });
// };

import { v2 as cloudinary } from "cloudinary";
import { logger } from "../utils/logger.js";
import "dotenv/config";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  timeout: 60000,
});

export const uploadMediaToCloudinary = async (file) => {
  try {
    logger.info(`Starting upload to Cloudinary: ${file.originalname}`);

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "auto",
          folder: "uploads", // Optional: organize uploads in folders
        },
        (error, result) => {
          if (error) {
            logger.error("Cloudinary upload error:", error);
            reject(error);
          } else {
            logger.info(`Upload successful. Public ID: ${result.public_id}`);
            resolve(result);
          }
        }
      );

      // Add error handler for the stream
      uploadStream.on("error", (error) => {
        logger.error("Upload stream error:", error);
        reject(error);
      });

      uploadStream.end(file.buffer);
    });
  } catch (error) {
    logger.error("Error in uploadMediaToCloudinary:", error);
    throw error;
  }
};

export const deleteMediaFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    logger.info("Media deleted successfuly from cloud stroage", publicId);
    return result;
  } catch (e) {
    logger.error("Error deleting media from cludinary", e);
    throw e;
  }
};
