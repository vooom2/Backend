require("dotenv").config();
const mongoose = require("mongoose");

const protectionPlanSchema = new mongoose.Schema(
  {
    maintenance_charge: {
      type: Number,
      default: 0,
    },
    plans_detail: {
      type: String,
    },
    plans_benefits: [
      {
        available: {
          type: Boolean,
        },
        benefit: {
          type: String,
        },
        show: {
          type: Boolean,
          default: true,
          required: true,
        },
      },
    ],
    active: {
      type: Boolean,
      default: true,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ProtectionPlan", protectionPlanSchema);
