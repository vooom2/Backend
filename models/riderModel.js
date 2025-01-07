require("dotenv").config();
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const riderSchema = new Schema(
  {
    account_type: {
      type: String,
      require: true,
      default: "rider",
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
      lowercase: true,
      required: true,
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
    },
    email_verified: {
      type: Boolean,
      default: false,
    },
    number_verified: {
      type: Boolean,
      default: false,
    },
    verification_documents: [
      {
        document_url: {
          type: String,
        },
        verified: {
          type: Boolean,
          default: false,
        },
        submittedAt: {
          type: Date,
          default: Date.now(),
        },
      },
    ],
    guarantor_documents: [
      {
        full_name: {
          type: String,
        },
        email: {
          type: String,
        },
        phone_number: {
          type: Number,
        },
        organization: {
          type: String,
        },
        location: {
          type: String,
        },
        gender: {
          type: String,
        },
        verified: {
          type: Boolean,
          default: false,
        },
        submittedAt: {
          type: Date,
          default: Date.now(),
        },
      },
    ],
    // NOTE: change back to false
    account_verified: {
      type: Boolean,
      default: true,
    },
    account_active: {
      type: Boolean,
      default: true,
    },
    gender: {
      type: String,
      default: "",
    },

    protection_plan_subscription: {
      type: Schema.Types.ObjectId,
      default: null,
      ref: "ProtectionPlan",
    },
    vehicle: {
      type: Schema.Types.ObjectId,
      ref: "Vehicle",
      default: null,
    },
    missed_payments: {
      type: Number,
      default: 0,
    },
    rider_rating: {
      payment_reliability: {
        type: String,
        enum: ["Excellent", "Good", "Poor"],
        default: "Good",
      },
      default_history: {
        type: String,
        enum: ["Clean", "Defaulted"],
        default: "Clean",
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Rider", riderSchema);
