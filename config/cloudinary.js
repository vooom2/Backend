require("dotenv").config();
const cloudinary = require("cloudinary").v2;
const multer = require("multer");

// Configure Cloudinary
cloudinary.config({
  cloud_name: "dzzoy14ax",
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Set up multer for image upload
const multerUpload = multer({ storage: multer.memoryStorage() });

module.exports = {
  cloudinaryConfig: cloudinary,
  multerUpload,
};
