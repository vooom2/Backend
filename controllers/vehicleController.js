const vehicleOwnerModel = require("../models/vehicleOwnerModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const inspectionModel = require("../models/inspectionModel");
const { SEND_NOTIFICATION_FUNCTION } = require("./notificationController");
const vehicleModel = require("../models/vehicleModel");
const checkVehicleRequiredProperties = (req, res, next) => {
  const {
    pick_up_location,
    vehicle_type,
    vehicle_company,
    chassis_number,
    // vehicle_name,
    // model,
    // timeline_rent,
    // available_date,
    // distance_allowed,
    // features,
    // health_status,
  } = req.body;

  // const {
  //   gear_transmission,
  //   gps,
  //   rear_camera,
  //   bluetooth,
  //   usb_in,
  //   usb_out,
  //   aux_in,
  //   android_auto,
  // } = features;

  // const { body_exterior, engine, additional_note } = health_status;

  const requiredProperties = [
    pick_up_location,
    vehicle_type,
    vehicle_company,
    chassis_number,
    // vehicle_name,
    // model,
    // timeline_rent,
    // available_date,
    // distance_allowed,
    // features,
    // health_status,
    // gear_transmission,
    // gps,
    // rear_camera,
    // bluetooth,
    // usb_in,
    // usb_out,
    // aux_in,
    // android_auto,
    // body_exterior,
    // engine,
    // additional_note,
  ];

  console.log({ body: req.body });

  const missingProperties = requiredProperties.filter((property) => {
    console.log(property);
    return !property;
  });
  console.log({ missingProperties });

  if (missingProperties.length > 0) {
    return res.status(400).send({
      message: `The following properties are required: ${missingProperties.join(
        ", "
      )}`,
    });
  }

  next();
};

async function CREATE_INSPECTION_FUNCTION({
  rider,
  vehicle,
  description,
  status,
  due_date,
}) {
  const createdInspection = await inspectionModel.create({
    rider,
    vehicle,
    description,
    status,
    due_date,
  });

  SEND_NOTIFICATION_FUNCTION(rider, description);

  const savedInspection = await createdInspection.save();
  return savedInspection;
}

async function hostVehicle(body, userId) {
  try {
    const {
      make,
      model,
      state,
      lga,
      color,
      vehicle_number,
      // vehicle_images,
      chasis_state,
      initial_mileage,
      documents,
      features,
    } = body;

    const vehicle = await vehicleModel.create({
      vehicle_owner: userId,
      make,
      model,
      state,
      lga,
      color,
      vehicle_number,
      // vehicle_images,
      chasis_state,
      initial_mileage,
      documents,
      features,
    });
    if (vehicle) {
      return true;
    }

    return false;
  } catch (error) {
    console.error("vehicle_hosting_controller", error.message);
    return false;
  }
}

module.exports = {
  checkVehicleRequiredProperties,
  CREATE_INSPECTION_FUNCTION,
  hostVehicle,
};
