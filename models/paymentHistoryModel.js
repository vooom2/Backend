require("dotenv").config();
const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const Schema = mongoose.Schema;

const paymentHistorySchema = new Schema(
  {
    rider: {
      type: Schema.Types.ObjectId,
      ref: "Rider",
      required: true,
    },
    payment: {
      type: Schema.Types.ObjectId,
      ref: "Payment",
      required: true,
    },
    description: { type: String, required: true },
    payment_date: { type: Date, required: true, default: Date.now() },
    payment_amount: { type: Number, required: true },
    vehicle: {
      type: Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true,
    },
    payment_status: {
      type: String,
      enum: ["on_time", "late", "missed"],
      default: "on_time",
    },
  },
  {
    timestamps: true,
  }
);

paymentHistorySchema.plugin(mongoosePaginate);

module.exports = mongoose.model("PaymentHistory", paymentHistorySchema);

