"use strict";

const moment = require("moment");
const {
  SEND_NOTIFICATION_FUNCTION,
} = require("../controllers/notificationController");
const {
  checkVehicleRequiredProperties,
} = require("../controllers/vehicleController");
const { checkAccessOnlyOwner, jwtValidator } = require("../middleware/jwt");
const vehicleModel = require("../models/vehicleModel");
const riderModel = require("../models/riderModel");
const paymentModel = require("../models/paymentModel");
const { VERIFY_PAYMENT_FUNCTION } = require("../controllers/paymentController");
const generalSettingsModel = require("../models/generalSettingsModel");

require("dotenv").config();
const vehicleRoute = require("express").Router();

vehicleRoute.get("/", async (req, res) => {
  const { vehicle_id } = req.query;
  try {
    // console.log({ userId, accountType });
    if (vehicle_id) {
      const vehicle = await vehicleModel.findOne({
        _id: vehicle_id,
      })
        .populate("vehicle_owner", "full_name createdAt")
        .populate("rider", "full_name")
      // let hostedVehicle = [];
      // if (
      //   vehicle
      // ) {
        // console.log({ vehicle })

      //   hostedVehicle = await vehicleModel.find({
      //     vehicle_owner: vehicle.vehicle_owner._id,
      //   });
      // }
      // // vehicle.vehicle_owner.hostedVehicle = hostedVehicle.length
      // // Directly add the hostedVehicle count to the populated vehicle_owner
      // if (vehicle.vehicle_owner) {
      //   vehicle.vehicle_owner = vehicle.vehicle_owner.toObject(); // Convert to plain object
      //   vehicle.vehicle_owner.hostedVehicle = hostedVehicle.length; // Add hostedVehicle property
      // }
      // console.log(vehicle.vehicle_owner)
      if (!vehicle) {
        return res.status(404).send({
          okay: false,
          message: "No vehicle found with this ID",
        });
      }
      return res.status(200).send({
        okay: true,
        vehicle,
      });
    }
    const vehicles = await vehicleModel.find({
      verified_vehicle: true,
      active_vehicle: true,
      rider: null
    }).populate("vehicle_owner", "full_name createdAt")
      .populate("rider", "full_name")
    return res.status(200).send({
      okay: true,
      vehicles,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      ok: false,
      message: "Error getting protection plans",
      error: error.message,
    });
  }
});

vehicleRoute.get("/setting", async (req, res) => {
  const { setting_id } = req.query;
  try {
    // // console.log({ userId, accountType });
    // if (setting_id) {
    //   const setting = await generalSettingsModel.findOne({});

    //   return res.status(200).send({
    //     okay: true,
    //     setting,
    //   });
    // }
    const setting = await generalSettingsModel.findOne({});
    return res.status(200).send({
      okay: true,
      setting,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      ok: false,
      message: "Error getting protection plans",
      error: error.message,
    });
  }
});

vehicleRoute.get(
  "/owner",
  jwtValidator,
  checkAccessOnlyOwner,
  async (req, res) => {
    const { userId, accountType } = res.locals;
    const { vehicle_id } = req.query;
    try {
      console.log({ vehicle_id });
      if (vehicle_id) {
        const vehicle = await vehicleModel.findOne({
          // vehicle_owner: userId,
          _id: vehicle_id,
        })
          .populate("rider", "full_name")

        if (!vehicle) {
          return res.status(404).send({
            okay: false,
            message: "No vehicle found with this ID",
          });
        }
        return res.status(200).send({
          okay: true,
          vehicle,
        });
      }

      const vehicles = await vehicleModel.find({
        vehicle_owner: userId,
      })
        .populate("rider", "full_name")


      return res.status(200).send({
        okay: true,
        vehicles,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        ok: false,
        message: "Error getting vehicle",
        error: error.message,
      });
    }
  }
);

vehicleRoute.get(
  "/rider",
  jwtValidator,

  async (req, res) => {
    const { userId, accountType } = res.locals;
    const { vehicle_id } = req.query;
    try {
      if (vehicle_id) {
        const vehicle = await vehicleModel.findOne({
          vehicle_owner: userId,
          _id: vehicle_id,
        });

        if (!vehicle) {
          return res.status(404).send({
            okay: false,
            message: "No vehicle found with this ID",
          });
        }

        return res.status(200).send({
          okay: true,
          vehicle,
        });
      }

      const vehicle = await vehicleModel.findOne({
        rider: userId,
      });

      return res.status(200).send({
        okay: true,
        vehicle,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        ok: false,
        message: "Error getting protection plans",
        error: error.message,
      });
    }
  }
);

vehicleRoute.post(
  "/rider/book-inspection",
  jwtValidator,

  async (req, res) => {
    const { userId, accountType } = res.locals;
    const { vehicle_id } = req.query;
    try {
      if (!vehicle_id) {
        return res.status(400).send({
          okay: false,
          message: "requires vehicle ID",
        });
      }
      const vehicle = await vehicleModel.findOne({
        _id: vehicle_id,
      });
      if (!vehicle) {
        return res.status(404).send({
          okay: false,
          message: "Vehicle not found",
        });
      }
      // console.log({ vehicle });
      // update car
      vehicle.booked_inspection.push({
        rider: userId,
        date: moment().format("llll"),
      });
      // send owner and rider Notification
      SEND_NOTIFICATION_FUNCTION(userId, "Vehicle Inspection Booked");
      SEND_NOTIFICATION_FUNCTION(
        vehicle.vehicle_owner,
        "Inspection was Booked"
      );

      await vehicle.save();
      return res.status(200).send({
        okay: true,
        // vehicle,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        ok: false,
        message: "Error getting protection plans",
        error: error.message,
      });
    }
  }
);

vehicleRoute.delete(
  "/rider/book-inspection",
  jwtValidator,

  async (req, res) => {
    const { userId, accountType } = res.locals;
    const { vehicle_id } = req.query;
    try {
      if (!vehicle_id) {
        return res.status(400).send({
          okay: false,
          message: "requires vehicle ID",
        });
      }
      const vehicle = await vehicleModel.findOneAndUpdate(
        { _id: vehicle_id },
        { $pull: { booked_inspection: { rider: userId } } },
        { new: true }
      );
      if (!vehicle) {
        return res.status(404).send({
          okay: false,
          message: "Vehicle not found",
        });
      }

      // send owner and rider Notification
      SEND_NOTIFICATION_FUNCTION(userId, "Vehicle Inspection Cancelled");
      SEND_NOTIFICATION_FUNCTION(
        vehicle.vehicle_owner,
        "Inspection was Cancelled"
      );

      return res.status(200).send({
        okay: true,
        vehicle,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        ok: false,
        message: "Error getting protection plans",
        error: error.message,
      });
    }
  }
);

vehicleRoute.put(
  "/rider/book-inspection",
  jwtValidator,

  async (req, res) => {
    const { userId, accountType } = res.locals;
    const { vehicle_id } = req.query;
    const { payment_amount, payment_type, payment } = req.body;
    try {
      const down_payment_type = ["half_payment", "full_payment"];

      if (!payment_type || !down_payment_type.includes(payment_type)) {
        return res.status(400).send({
          okay: false,
          message: "Invalid payment type",
        });
      }
      if (!vehicle_id) {
        return res.status(400).send({
          okay: false,
          message: "requires vehicle ID",
        });
      }
      if (!payment) {
        return res.status(401).send({
          okay: false,
          message: "Invalid Payment",
        });
      }

      // Check if the rider has an active vehicle
      const vehicle = await vehicleModel.findOne({ _id: vehicle_id });

      if (vehicle.rider) {
        return res.status(400).send({
          okay: false,
          message: "Rider has a vehicle",
        });
      }

      // Check if the vehicle has a rider
      const rider = await riderModel.findOne({ _id: userId });

      if (rider.vehicle) {
        return res.status(400).send({
          okay: false,
          message: "Vehicle has a Rider",
        });
      }

      // check if the vehicle is active
      if (!vehicle.active_vehicle || !vehicle.verified_vehicle) {
        return res.status(400).send({
          okay: false,
          message: "Vehicle is inactive",
        });
      }
      // console.log({ rider: rider });
      // check if the rider is active
      if (!rider.account_verified || !rider.account_active) {
        return res.status(400).send({
          okay: false,
          message: "Rider is inactive",
        });
      }

      const verifyPayment = await VERIFY_PAYMENT_FUNCTION({
        vehicle_id,
        userId,
        payment_type,
        payment,
        payment_amount,
      });
      // return res.status(200).send({
      //   okay: true,
      //   verifyPayment,
      // });

      // update vehicle
      const updatedVehicle = await vehicleModel.findOneAndUpdate(
        { _id: vehicle_id },
        { $set: { rider: userId } },
        { new: true }
      );
      // update rider
      const updatedRider = await riderModel.findOneAndUpdate(
        { _id: userId },
        { $set: { vehicle: vehicle_id } },
        { new: true }
      );
      if (!updatedVehicle || !updatedRider) {
        return res.status(404).send({
          okay: false,
          message: "Vehicle/Rider not updated",
        });
      }
      // create payment for
      // send owner and rider Notification
      SEND_NOTIFICATION_FUNCTION(
        userId,
        "Vehicle Inspection Confirmed Successful"
      );
      SEND_NOTIFICATION_FUNCTION(
        vehicle.vehicle_owner,
        "Vehicle has been assigned to rider"
      );

      return res.status(200).send({
        okay: true,
        vehicle,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        ok: false,
        message: "Error getting protection plans",
        error: error.message,
      });
    }
  }
);

vehicleRoute.get(
  "/rider/book-inspection",
  jwtValidator,

  async (req, res) => {
    const { userId, accountType } = res.locals;
    const { vehicle_id } = req.query;
    try {
      const vehicles = await vehicleModel.find({
        "booked_inspection.rider": userId,
      });

      return res.status(200).send({
        okay: true,
        vehicles,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        ok: false,
        message: "Error getting protection plans",
        error: error.message,
      });
    }
  }
);

vehicleRoute.post(
  "/",
  jwtValidator,
  checkVehicleRequiredProperties,
  // checkAccessOnlyOwner,
  async (req, res) => {
    const { userId, accountType } = res.locals;
    const { owner_id } = req.query;

    const {
      pick_up_location,
      vehicle_type,
      vehicle_company,
      vehicle_name,
      model,
      timeline_rent,
      available_date,
      distance_allowed,
      features,
      health_status,
      vehicle_images,
    } = req.body;

    if (accountType !== "manger" && accountType !== "admin" && accountType !== "owner") {
      return res.status(401).send({
        ok: false,
        message: "Account Type is not Authorized to make this request"
      })
    }

    try {
      const newVehicle = new vehicleModel({
        vehicle_owner: accountType === "admin" || accountType === "manger" ? owner_id : userId,
        vehicle_images,
        pick_up_location,
        vehicle_type,
        vehicle_company,
        vehicle_name,
        model,
        timeline_rent,
        available_date,
        distance_allowed,
        features,
        health_status,
      });

      const savedVehicle = await newVehicle.save();
      return res.status(200).send({
        okay: true,
        vehicle: savedVehicle,
        // plan: newVehicle,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        ok: false,
        message: "Error getting protection plans",
        error: error.message,
      });
    }
  }
);

vehicleRoute.put("/", jwtValidator, async (req, res) => {
  const { userId, accountType } = res.locals;

  const vehicleUpdate = req.body;
  try {
    let newVehicleUpdate = await User.updateOne({ _id: userId }, vehicleUpdate);
    if (!newVehicleUpdate.acknowledged) {
      return res
        .status(404)
        .send({ ok: false, message: "Vehicle was not updated" });
    }
    return res.send({ ok: true });
  } catch (error) {
    // console.log(error.keyValue);
    res.status(500).send({
      ok: false,
      message: "Error updating Vehicle",
      error: error.message,
    });
  }
});

module.exports = vehicleRoute;
