const { VERIFY_PAYMENT } = require("../../controllers/paymentController");
const PaymentHistory = require("../../models/paymentHistoryModel");
const Payment = require("../../models/paymentModel");
const riderModel = require("../../models/riderModel");
const vehicleModel = require("../../models/vehicleModel");

const paymentHook = require("express").Router();

paymentHook.get("", async (req, res) => {
  try {
    return VERIFY_PAYMENT(req, res);
  } catch (error) {
    return res.status(400).send(error.message);
  }
});

module.exports = paymentHook;
