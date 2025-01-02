const { default: mongoose } = require("mongoose");
const Schema = mongoose.Schema;

const walletHistorySchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "VehicleOwner",
      require: true,
      default: null,
    },

    wallet: {
      type: Schema.Types.ObjectId,
      ref: "Wallet",
      require: true,
    },
    type: {
      type: Schema.Types.String,
      default: "credit",
      require: true,
    },
    description: {
      type: Schema.Types.String,
      require: true,
    },
    newBalance: {
      type: Number,
      require: true,
    },
    oldBalance: {
      type: Number,
      require: true,
    },
    amount: {
      type: Number,
      require: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("WalletHistory", walletHistorySchema);
