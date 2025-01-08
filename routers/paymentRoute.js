const {
  CREATE_PAYMENT_HISTORY_FUNCTION,
  CREATE_PAYMENT_FUNCTION,
  VERIFY_PAYMENT_FUNCTION,
} = require("../controllers/paymentController");
const PaymentHistory = require("../models/paymentHistoryModel");
const Payment = require("../models/paymentModel");
const riderModel = require("../models/riderModel");
const vehicleModel = require("../models/vehicleModel");

const paymentRoute = require("express").Router();




paymentRoute.post("/", async (req, res) => {
  const { userId, accountType } = res.locals;
  const {
    vehicle,
    payment_amount,
    description,
    payment_status,
    overdue_charges,
    payment_due_date,
    payment,
  } = req.body;

  try {
    const requiredFields = [
      "vehicle",
      "payment_amount",
      "description",
      "payment_status",
      "overdue_charges",
      "payment_due_date",
    ];

    for (const field of requiredFields) {
      if (typeof req.body[field] === "string" && !req.body[field].trim()) {
        return res
          .status(400)
          .send({ okay: false, message: `Input Required for ${field}` });
      } else if (req.body[field] === null || req.body[field] === undefined) {
        return res
          .status(400)
          .send({ okay: false, message: `Input Required for ${field}` });
      }
    }
    const createPayment = await CREATE_PAYMENT_FUNCTION({
      rider: userId,
      vehicle,
      payment_amount,
      description,
      payment_status,
      overdue_charges,
      payment_due_date,
      payment,
    });
    res.status(201).send({ okay: true, createPayment });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

paymentRoute.get("/", async (req, res) => {
  const { userId, accountType } = res.locals;
  const { vehicle_id, rider_id, owner_id } = req.query;
  console.log({ userId, accountType });
  try {
    let query = {};
    if (accountType === "rider") {
      query = { rider: userId };
    }
    if (
      accountType === "admin" ||
      accountType === "manger" ||
      accountType === "compliance" ||
      accountType === "accountant"
    ) {
      query = {};
      if (vehicle_id) {
        query = { vehicle: vehicle_id };
      }
      if (rider_id) {
        query = { rider: rider_id };
      }
      if (rider_id) {
        query = { rider: owner_id };
      }
    }

    // console.log({ query })
    let payments = await Payment.find(query)
      .populate("rider", "full_name")
      .populate("vehicle", "vehicle_number model")
      .sort({ createdAt: -1 });

    res.send({ okay: true, payments });
  } catch (error) {
    res.status(404).send(error.message);
  }
});

paymentRoute.get("/payments/vehicle/:vehicleId", async (req, res) => {
  try {
    const payments = await Payment.find({ vehicle: req.params.vehicleId });
    res.send(payments);
  } catch (error) {
    res.status(404).send(error.message);
  }
});

paymentRoute.put("/", async (req, res) => {
  const { userId, accountType } = res.locals;
  const { payment, vehicle_id, payment_id, amount } = req.body;
  try {
    if (payment.status !== "success") {
      return res.status(400).send({ okay: false, message: "Payment Failed" });
    }
    if (!payment_id || !vehicle_id) {
      return res.status(400).send({ okay: false, message: "Payment Failed" });
    }

    // return console.log({ vehicle_id, payment_id });
    const getPayment = await Payment.findOne({ _id: payment_id });
    if (!getPayment) {
      return res
        .status(404)
        .send({ okay: false, message: "Payment not found" });
    }

    if (
      accountType === "admin" ||
      accountType === "manger" ||
      accountType === "compliance" ||
      accountType === "accountant"
    ) {
      // TODO: add a log of admin that make this action
      if (getPayment.payment_amount !== amount) {
        return res.status(400).send({
          okay: false,
          message: "Payment amount is not complete",
        });
      }
    }
    getPayment.payment = payment;
    getPayment.payment_status = "paid";

    const paymentUpdate = await getPayment.save();

    // console.log({ paymentUpdate });
    let returnedPaymentHistory = await CREATE_PAYMENT_HISTORY_FUNCTION({
      rider: userId,
      vehicle: vehicle_id,
      payment_amount: getPayment.payment_amount,
      description: getPayment.description,
      payment_status:
        getPayment.payment_status == "pending" ? "on_time" : "late",
      overdue_charges: getPayment.overdue_charges,
      payment: getPayment._id,
    });

    res.send({ okay: true });
  } catch (error) {
    console.log(error);
    res.status(404).send({
      okay: false,
      error: error.message,
      message: "Error updating payment",
    });
  }
});

paymentRoute.get("/payments/:paymentId", async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.paymentId);
    res.send(payment);
  } catch (error) {
    res.status(404).send(error.message);
  }
});

paymentRoute.post("/payment-history", async (req, res) => {
  try {
    const paymentHistory = new PaymentHistory(req.body);
    await paymentHistory.save();
    res.status(201).send(paymentHistory);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

paymentRoute.get("/payment-history/rider/:riderId", async (req, res) => {
  try {
    const paymentHistory = await PaymentHistory.find({
      rider: req.params.riderId,
    });
    res.send(paymentHistory);
  } catch (error) {
    res.status(404).send(error.message);
  }
});

paymentRoute.get("/payment-history/vehicle/:vehicleId", async (req, res) => {
  try {
    const paymentHistory = await PaymentHistory.find({
      vehicle: req.params.vehicleId,
    });
    res.send(paymentHistory);
  } catch (error) {
    res.status(404).send(error.message);
  }
});

paymentRoute.get("/payment-history/payment/:paymentId", async (req, res) => {
  try {
    const paymentHistory = await PaymentHistory.find({
      payment: req.params.paymentId,
    });
    res.send(paymentHistory);
  } catch (error) {
    res.status(404).send(error.message);
  }
});

module.exports = paymentRoute;
