require("dotenv").config();
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const adminSchema = new Schema(
  {
    account_type: {
      type: String,
      required: true,
      enum: ["admin", "accountant", "compliance", "manger"], // Add the allowed values here
    },
    user_avatar: {
      type: String,
    },
    full_name: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
    },
    player_id: {
      type: String,
    },
    phone_number: {
      type: Number,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },

    email_verified: {
      type: Boolean,
      default: false,
    },
    number_verified: {
      type: Boolean,
      default: false,
    },
    // NOTE: change back to false
    account_verified: {
      type: Boolean,
      default: true,
    },
    account_active: {
      type: Boolean,
      default: true,
    },
    gender: {
      type: String,
      default: "",
    },

    invited_by: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
      required: true, default: null
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Admin", adminSchema);
