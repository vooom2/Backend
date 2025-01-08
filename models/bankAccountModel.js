const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bankAccountSchema = new Schema(
  {
    account_name: {
      type: String,
      required: true,
    },
    account_number: {
      type: String,
      required: true,
      unique: true,
    },
    bank_code: {
      type: String,
      required: true,
    },
    bank_name: {
      type: String,
      required: true,
    },
    recipient_code: {
      type: String,
      required: true,
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "vehicleOwner",
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("BankAccount", bankAccountSchema);
