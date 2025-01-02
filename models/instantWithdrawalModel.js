// models/instantWithdrawal.js

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const instantWithdrawalSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "VehicleOwner",
      require: true,
      default: null,
    },
    paymentId: {
      type: String,
      unique: true, // Ensure payment references are unique
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed", "success"],
      default: "pending",
    },
    source: {
      type: String,
    },
    currency: {
      type: String,
    },
    requested_time: {
      type: String,
    },
    transfer_code: {
      type: String,
    },
    amount: {
      type: Number,
    },
    // Other withdrawal-related fields
  },
  {
    timestamps: true,
  }
);

const InstantWithdrawal = mongoose.model(
  "InstantWithdrawal",
  instantWithdrawalSchema
);

module.exports = InstantWithdrawal;
