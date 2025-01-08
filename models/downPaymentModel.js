const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const downPaymentSchema = new Schema(
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
    paid: {
      type: Boolean,
      default: false,
    },
    transaction_id: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("DownPayment", downPaymentSchema);
