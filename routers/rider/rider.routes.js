const express = require("express");
const riderRoute = express.Router();
const Joi = require("joi");
const {
  startComplaint,
  getComplaints,
} = require("../../controllers/complaintController");
const { isUserType } = require("../../middleware/isVerifiedUser");
const {
  GET_RIDER_PAYMENT_LIST,
  INITIALIZE_PAYMENT,
  RIDER_PAYMENT_SUM,
} = require("../../controllers/paymentController");
const vehicleModel = require("../../models/vehicleModel");
const downPaymentModel = require("../../models/downPaymentModel");
const { paystack, inKobo } = require("../../helpers/paystack.helper");
moment = require("moment");
const inspectionModel = require("../../models/inspectionModel");
// Example route to get rider profile

riderRoute.use(isUserType("rider"));
riderRoute.post("/complaints", async (req, res) => {
  const schema = Joi.object({
    category: Joi.string().valid("vehicle-accident").required(),
    date: Joi.date().iso().required(),
    time: Joi.string()
      .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
      .required(),
    fleetManager: Joi.string().hex().length(24).required(),
    location: Joi.string().required(),
    detail: Joi.string().required(),
    images: Joi.array().items(Joi.string().uri()).min(1).max(2).required(),
  });
  const { error } = schema.validate(req.body);
  if (error) {
    return res
      .status(400)
      .send({ ok: false, message: error.details[0].message });
  }

  try {
    return startComplaint(req, res);
  } catch (error) {
    console.log(error);
    res.status(500).send({ ok: false, message: "Error creating complaint" });
  }
});

riderRoute.get("/complaints/get", async (req, res) => {
  try {
    return getComplaints(req, res);
  } catch (error) {
    console.log(error);
    res.status(500).send({ ok: false, message: "Error getting complaints" });
  }
});

riderRoute.get("/payments", async (req, res) => {
  try {
    return GET_RIDER_PAYMENT_LIST(req, res);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ ok: false, message: "Error getting rider payments" });
  }
});

riderRoute.post("/payments", async (req, res) => {
  try {
    const schema = Joi.object({
      payment_id: Joi.string().hex().length(24).required(),
    });
    const { error } = schema.validate(req.body);
    if (error) {
      return res
        .status(400)
        .send({ ok: false, message: 'A valid "payment_id" is required' });
    }

    return INITIALIZE_PAYMENT(req, res);
  } catch (error) {
    console.log(error);
    res.status(500).send({ ok: false, message: "Error initializing payment" });
  }
});

riderRoute.get("/dashboard-stats", async (req, res) => {
  const { userId } = res.locals;
  //  total payments
  try {
    const total_payments = await RIDER_PAYMENT_SUM("paid", userId);
    const outstanding_payments = await RIDER_PAYMENT_SUM("pending", userId);

    //Due This week
    const weekly_due = Number(process.env.FIXED_REMITTANCE).toFixed(2);

    const latestInspection = await inspectionModel
      .findOne({ rider: userId })
      .sort({ createdAt: "desc" });
    const latestInspectionDate = latestInspection
      ? new Date(latestInspection.due_date)
      : null;

    //Days to next inspection
    const days_to_next_inspection = latestInspectionDate
      ? moment(latestInspectionDate).diff(moment(), "days")
      : null;

    res.send({
      ok: true,
      data: {
        total_payments: total_payments?.grandTotal.toFixed(2),
        weekly_due,
        outstanding_payments: outstanding_payments?.grandTotal.toFixed(2),
        inspection_count: 0,
        days_to_next_inspection: days_to_next_inspection || 0,
      },
    });
  } catch (error) {
    throw new Error(`Error calculating payment totals: ${error.message}`);
  }
});

riderRoute.get("/vehicle", async (req, res) => {
  const { userId } = res.locals;
  try {
    const vehicle = await vehicleModel.findOne({
      rider: userId,
      active_vehicle: true,
      verified_vehicle: true,
    });

    if (!vehicle) {
      return res.status(404).send({
        ok: false,
        message: "No approved vehicle assigned to rider",
      });
    }

    res.send({ ok: true, vehicle });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ ok: false, message: "Error getting assigned vehicle" });
  }
});

riderRoute.get("/vehicle/pending", async (req, res) => {
  const { userId } = res.locals;
  console.log(userId);
  try {
    const vehicle = await vehicleModel.findOne({
      rider: userId,
      verified_vehicle: true,
      active_vehicle: false,
    });

    if (!vehicle) {
      return res.status(404).send({
        ok: false,
        message: "No pending vehicle assigned to rider",
      });
    }

    res.send({ ok: true, vehicle });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ ok: false, message: "Error getting assigned vehicle" });
  }
});

riderRoute.post("/vehicle/downpayment", async (req, res) => {
  const { userId, email } = res.locals;
  try {
    const vehicle = await vehicleModel.findOne({
      rider: userId,
      active_vehicle: false,
      verified_vehicle: true,
    });

    if (!vehicle) {
      return res.status(404).send({
        ok: false,
        message: "No approved vehicle assigned to rider",
      });
    }

    const payment = new downPaymentModel({
      rider: userId,
      vehicle: vehicle._id,
      paid: false,
    });

    await payment.save();

    const payment_url = await paystack.transaction.initialize({
      amount: inKobo(process.env.DOWNPAYMENT), // convert to kobo
      email,
      metadata: {
        rider: userId,
        vehicle,
        payment_id: payment._id,
      },
      callback_url:
        process.env.API_BASEURL +
        `/api/payment/verify/downpayment?paymentID=${payment._id}`,
    });

    if (!payment_url) {
      return res.status(500).send({
        ok: false,
        message: "Error initializing payment gateway",
      });
    }

    return res.send({
      ok: true,
      payment_url,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ ok: false, message: "Error initializing payment" });
  }
});

module.exports = riderRoute;
