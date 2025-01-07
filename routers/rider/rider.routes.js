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
} = require("../../controllers/paymentController");
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

module.exports = riderRoute;
