const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const locationSpecsSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    remittance: {
      type: Number,
      required: true,
    },
    downPayment: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("LocationSpecs", locationSpecsSchema);

