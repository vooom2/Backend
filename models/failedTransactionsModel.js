const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const failedTransactionSchema = new Schema(
  {
    paymentId: {
      type: String,
      required: true,
      unique: true,
    },
    reason: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["failed", "pending"],
      default: "failed",
    },
    detail: {
      type: Object,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("FailedTransaction", failedTransactionSchema);
