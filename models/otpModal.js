require("dotenv").config();
const mongoose = require("mongoose");

const OtpSchema = new mongoose.Schema(
  {
    to: {
      type: String,
      required: true,
    },
    otp: {
      type: Number,
      required: true,
      unique: true,
    },

    createdAt: {
      type: Date,
      required: true,
      default: Date.now(),
    },
  }
  // , timestamp: {true}
);

module.exports = mongoose.model("Otp", OtpSchema);
