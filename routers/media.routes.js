const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const mediaRoutes = express.Router();

// Multer configuration
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "diki2xwvj",
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper function to upload to Cloudinary
const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const uploadOptions = {
      folder: "voom-media",
      use_filename: true,
      unique_filename: false,
      resource_type: "auto", // Automatically detect file type
    };

    cloudinary.uploader
      .upload_stream(uploadOptions, (error, result) => {
        if (error) reject(error);
        else resolve(result);
      })
      .end(buffer);
  });
};

// Upload endpoint
mediaRoutes.post("/upload", upload.single("file"), async (req, res) => {
  try {
    // Check if file exists
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    // Validate file type if needed
    const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
    if (!allowedTypes.includes(req.file.mimetype)) {
      return res.status(400).json({
        success: false,
        message: "Invalid file type. Only JPEG, PNG and PDF are allowed",
      });
    }

    // Upload to Cloudinary
    const result = await uploadToCloudinary(req.file.buffer);

    // Return success response
    return res.status(200).json({
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({
      success: false,
      message: "Error uploading file",
      error: error.message,
    });
  }
});

// Error handling middleware
mediaRoutes.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "File is too large. Maximum size is 5MB",
      });
    }
  }
  next(error);
});

module.exports = mediaRoutes;
