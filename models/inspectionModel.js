require("dotenv").config();
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const inspectionSchema = new Schema(
  {
    rider: {
      type: Schema.Types.ObjectId,
      ref: "Rider",
      required: true,
    },
    vehicle: {
      type: Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true,
    },

    description: { type: String, required: true },
    reason: { type: String },
    status: {
      type: String,
      enum: ["Pending", "Pass", "Failed"],
      default: "Pending",
    },
    due_date: {
      type: Date,
      required: true,
    },
    inspector: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
      // required: true,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Inspection", inspectionSchema);
