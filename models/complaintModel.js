const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const complaintSchema = new mongoose.Schema(
  {
    rider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Rider",
      required: true,
    },
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true,
    },
    category: {
      type: String,
      enum: ["vehicle-accident", "maintenance", "vio"],
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    fleetManager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FleetManager",
      // required: true,
    },
    location: {
      type: String,
      required: true,
    },
    detail: {
      type: String,
      required: true,
    },
    images: [
      {
        type: String,
      },
    ],
    status: {
      type: String,
      enum: ["Pending", "Approved", "Declined"],
      default: "Pending",
    },
    managerResponses: [
      {
        response: {
          type: String,
        },
        date: {
          type: Date,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

complaintSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Complaint", complaintSchema);
