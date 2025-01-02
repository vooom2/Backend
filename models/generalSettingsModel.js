require("dotenv").config();
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const paymentSchema = new Schema(
  {
    bike_payment_amount: { type: Number, required: true, default: 20000 },
    bike_overdue_charges: { type: Number, default: 5 },
    bike_down_amount_amount: { type: Number, default: 40000 },
    down_payment_type: [
      {
        type: String,
        default: ["half_payment", "full_payment"],
      },
    ],
    settings_history: {
      type: Array,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("GeneralSetting", paymentSchema);
