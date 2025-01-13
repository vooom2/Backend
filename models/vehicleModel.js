require("dotenv").config();
const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const Schema = mongoose.Schema;

const vehicleSchema = new Schema(
  {
    vehicle_owner: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "VehicleOwner",
    },
    booked_inspection: [
      {
        rider: {
          type: Schema.Types.ObjectId,
          default: null,
          ref: "Rider",
        },
        date: {
          type: String,
        },
      },
    ],
    vehicle_images: [
      {
        type: String,
      },
    ],
    pick_up_location: {
      type: String,
    },
    vehicle_type: {
      type: String,
    },
    state: {
      type: String,
    },
    lga: {
      type: String,
    },
    vehicle_number: {
      type: String,
    },
    plate_number: {
      type: String,
    },
    vehicle_company: {
      type: String,
    },
    initial_mileage: {
      type: String,
    },
    vehicle_name: {
      type: String,
    },
    make: {
      type: String,
    },
    model: {
      type: String,
    },
    chasis_state: {
      type: String,
    },
    chassis_number: {
      type: String,
    },
    timeline_rent: {
      type: String,
    },
    available_date: {
      type: String,
    },
    distance_allowed: {
      type: String,
    },
    features: {
      type: Object,
    },
    health_status: {
      body_exterior: {
        type: String,
      },
      engine: {
        type: String,
      },
      Additional_note: {
        type: String,
      },
    },
    verified_vehicle: {
      type: Boolean,
      default: false,
      required: true,
    },
    active_vehicle: {
      type: Boolean,
      default: false,
      required: true,
    },
    rider: {
      type: Schema.Types.ObjectId,
      ref: "Rider",
      default: null,
    },
    documents: {
      type: {
        vio: {
          type: String,
        },
        amac: {
          type: String,
        },
        lga: {
          type: String,
        },
        insurance: {
          type: String,
        },
        receipt: {
          type: String,
        },
      },
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

vehicleSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Vehicle", vehicleSchema);

