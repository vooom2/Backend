const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate-v2");

const fleetManagerSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "Fleet Manager",
  },
  avatar: {
    type: String,
    default:
      "https://res.cloudinary.com/dqcsk8rii/image/upload/v1647634547/avatars/default-avatar_fkqgqc.png",
  },
  state: {
    type: String,
  },
  lga: {
    type: String,
  },
  location: {
    type: String,
  },
});

fleetManagerSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("FleetManager", fleetManagerSchema);
