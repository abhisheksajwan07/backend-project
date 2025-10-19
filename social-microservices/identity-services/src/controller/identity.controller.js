import { User } from "../models/user.model.js";
import { logger } from "../utils/logger.js";
import { validatelogin, validateRegistration } from "../utils/validation.js";
import { generateToken } from "../utils/generateToken.js";
import { RefreshToken } from "../models/refresh.model.js";

export const registerUser = async (req, res) => {
  logger.info("Registration endpoint hit...");

  logger.info("Request body:", JSON.stringify(req.body, null, 2));
  try {
    const { error } = validateRegistration(req.body);
    if (error) {
      logger.warn("validation err", error.details[0].message);
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }
    const { email, username, password } = req.body;
    let user = await User.findOne({ $or: [{ email }, { username }] });
    if (user) {
      logger.warn("User already exists");
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    user = await new User({ username, email, password });
    await user.save();
    logger.warn("User saved successfully", user._id);

    const { accessToken, refreshToken } = await generateToken(user);

    res.status(201).json({
      success: true,
      message: "User registered successfully!",
      accessToken,
      refreshToken,
    });
  } catch (err) {
    logger.error("Registration error occured", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const loginUser = async (req, res) => {
  logger.info(`login endpoint hit`);
  try {
    const { error } = validatelogin(req.body);
    if (error) {
      logger.war("validation error", error.details[0].message);
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      logger.warn("Invalid user");
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      logger.warn("Invalid password");
      return res.status(400).json({
        success: false,
        message: "Invalid password",
      });
    }

    const { accessToken, refreshToken } = await generateToken(user);
    res.json({
      accessToken,
      refreshToken,
      userId: user._id,
    });
  } catch (err) {
    logger.error("Login error occured", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const refreshTokenUser = async (req, res) => {
  logger.info("Refresh token endpoint hit...");
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      logger.warn("Refresh token missing");
      return res.status(400).json({
        success: false,
        message: "refresh token missing",
      });
    }
    const storedToken = await RefreshToken.findOne({ token: refreshToken });
    if (!storedToken || storedToken.expiresAt < new Date()) {
      logger.warn("Invalid refresh token provided");
      return res.status(400).json({
        success: false,
        message: "Invalid refresh token",
      });
    }

    const user = await User.findById(storedToken.user);
    if (!user) {
      logger.warn(`user not found`);
      return res.status(401).json({
        success: false,
        message: "user not  found",
      });
    }

    const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
      await generateToken(user);

    await RefreshToken.deleteOne({ _id: storedToken._id });
    res.json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (err) {
    logger.error("Refresh token error occured", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const logoutUser = async (req, res) => {
  logger.info("Logout endpoints hit..");
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      logger.warn("Refresh token missing");
      return res.status(400).json({
        success: false,
        message: "Refresh token missing",
      });
    }
    const storedToken = await RefreshToken.findOneAndDelete({
      token: refreshToken,
    });
    if (!storedToken) {
      logger.war("Invalid refresh token provided");
      return res.status(400).json({
        success: false,
        message: "Invalid refresh token",
      });
    }
    logger.info("Refresh token deleted for logout");
    res.json({
      success: true,
      message: "Logged out successfully!",
    });
    
  } catch (err) {
    logger.error("Error while logging out", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
