const { default: mongoose } = require("mongoose");
const Schema = mongoose.Schema;

const walletSchema = new Schema(
  {

    owner: {
      type: Schema.Types.ObjectId,
      ref: "VehicleOwner",
      require: true,
      default: null,
    },

    balance: {
      type: Number,
      require: true,
      default: 0,
    },
    total_withdrawn: {
      type: Number,
      require: true,
      default: 0,
    },

    pin: {
      type: String,
      require: true,

    },

    bank: {
      type: Schema.Types.Mixed,
      require: true,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Wallet", walletSchema);
