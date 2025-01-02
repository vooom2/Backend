require("dotenv").config();
const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
    },
    user: {
      type: String,
      required: true,
      default: "*",
    },
    seen: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Notification", NotificationSchema);
