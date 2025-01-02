require("dotenv").config();
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const approvalSchema = new Schema(
  {
    rider: {
      type: Schema.Types.ObjectId,
      ref: "Rider", default: null,
    },
    vehicle: {
      type: Schema.Types.ObjectId,
      ref: "Vehicle", default: null,
    },

    description: { type: String, required: true },
    reason: { type: String, },
    status: {
      type: String,
      enum: ["Pending", "Approve", "Decline"],
      default: "Pending",
    },

    admin: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
      // required: true,
      default: null,

    },
    updated_by: {
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

module.exports = mongoose.model("Approval", approvalSchema);
