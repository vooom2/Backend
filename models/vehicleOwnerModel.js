require("dotenv").config();
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const vehicleOwnerSchema = new Schema(
  {
    account_type: {
      type: String,
      require: true,
      default: "owner",
    },
    user_avatar: {
      type: String,
    },
    full_name: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
    },
    player_id: {
      type: String,
    },
    phone_number: {
      type: Number,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    cloudinary_folder_id: {
      type: String,
    },
    withdrawal_pin: {
      type: Number,
      default: null,
    },

    email_verified: {
      type: Boolean,
      default: false,
    },
    number_verified: {
      type: Boolean,
      default: false,
    },
    verification_started: {
      type: Boolean,
      default: false,
    },
    verification_documents: [
      {
        document_url: {
          type: String,
        },
        verified: {
          type: String,
        },
        submittedAt: {
          type: Date,
          default: Date.now(),
        },
      },
    ],
    account_verified: {
      type: Boolean,
      default: false,
    },
    account_active: {
      type: Boolean,
      default: true,
    },
    img: {
      type: String,
    },
    country: {
      type: String,
    },
    state: {
      type: String,
    },
    address: {
      type: String,
    },
    gender: {
      type: String,
      default: "",
    },
    occupation: {
      type: String,
    },
    otp: {
      type: Number,
    },
 

    deleted: {
      type: Boolean,
      default: false,
    },

    protection_plan_subscription: {
      type: Schema.Types.ObjectId,
      default: null,
      ref: "ProtectionPlan",
    },
    wallet: {
      type: Schema.Types.ObjectId,
      ref: "Wallet",
      require: true,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("VehicleOwner", vehicleOwnerSchema);
