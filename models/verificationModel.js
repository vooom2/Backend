require("dotenv").config();
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const verification_documents = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  primaryID: {
    type: String,
    required: true,
  },
  secondaryID: {
    type: String,
  },
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
      state: {
        type: String,
      },
      address: {
        type: String,
      },
      img: {
        type: String,
      },
      workID: {
        type: String,
      },
      primaryID: {
        type: String,
      },
      submittedAt: {
        type: Date,
        default: Date.now(),
      },
    },
  ],
  submittedAt: {
    type: Date,
    default: Date.now(),
  },
  verified: {
    type: Boolean,
    default: false,
  },
  rejected: {
    type: Boolean,
    default: false,
  },
  rejected_reason: {
    type: String,
  },
  modifiedAt: {
    type: Date,
    default: null,
  },
  modifiedBy: {
    type: Schema.Types.ObjectId,
    ref: "Admin",
    default: null,
  },
});

module.exports = mongoose.model("Verifications", verification_documents);
