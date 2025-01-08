require("dotenv").config();
const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const Schema = mongoose.Schema;

const paymentSchema = new Schema(
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
    payment_amount: { type: Number, required: true },
    description: { type: String, required: true },
    payment_due_date: { type: Date, required: true, default: null },
    payment_status: {
      type: String,
      enum: ["pending", "paid", "overdue"],
      default: "pending",
    },
    reference: { type: String, default: null },
    overdue_charges: { type: Number, default: 0 },
    payment_date: { type: Date, default: null },
    payment: { type: Schema.Types.Mixed, default: null },
  },
  {
    timestamps: true,
  }
);
paymentSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Payment", paymentSchema);

