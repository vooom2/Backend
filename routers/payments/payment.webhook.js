const { VERIFY_PAYMENT } = require("../../controllers/paymentController");
const { paystack } = require("../../helpers/paystack.helper");
const downPaymentModel = require("../../models/downPaymentModel");
const vehicleModel = require("../../models/vehicleModel");
const vehicleOwnerModel = require("../../models/vehicleOwnerModel");

moment = require("moment");

const paymentHook = require("express").Router();

paymentHook.get("", async (req, res) => {
  try {
    return VERIFY_PAYMENT(req, res);
  } catch (error) {
    return res.status(400).send(error.message);
  }
});

paymentHook.get("/downpayment", async (req, res) => {
  try {
    const { paymentID, trxref } = req.query;
    const response = await paystack.transaction.verify({ reference: trxref });

    if (response.status && response.data.status === "success") {
      // Find and update downpayment document
      const downPayment = await downPaymentModel.findById(paymentID);
      if (!downPayment) {
        return res.redirect(
          process.env.PUBLIC_BASEURL + "rider/dashboard/payfailed?reason=A1"
        );
        // downpayment not found
      }

      downPayment.paid = true;
      downPayment.transaction_id = response.data.reference;
      await downPayment.save();

      // Find and update vehicle document

      console.log(downPayment.vehicle);
      const vehicle = await vehicleModel.findById(downPayment.vehicle);
      if (!vehicle) {
        return res.redirect(
          process.env.PUBLIC_BASEURL + "rider/dashboard/payfailed?reason=A2"
        );
        //vehicle not found
      }

      vehicle.active_vehicle = true;

      const inspectionModel = require("../../models/inspectionModel");

      const newInspection = new inspectionModel({
        rider: downPayment.rider,
        vehicle: downPayment.vehicle,
        description: "Routine Check",
        due_date: moment().add(14, "days").toISOString(),
      });

      await newInspection.save();

      await vehicle.save();

      return res.redirect(process.env.PUBLIC_BASEURL + "rider/dashboard/paysuccess");
    } else {
      return res.redirect(process.env.PUBLIC_BASEURL + "rider/dashboard/payfailed?reason=A3");
    }
  } catch (error) {
    return res.status(400).send(error.message);
  }
});

module.exports = paymentHook;
