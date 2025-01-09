const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const Schema = mongoose.Schema;

const reportSchema = new Schema(
  {
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "low",
    },
    description: {
      type: String,
      required: true,
    },
    vehicle: {
      type: Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "VehicleOwner",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

reportSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Report", reportSchema);
