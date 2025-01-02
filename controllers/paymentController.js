const Paystack = require("paystack-api");
const axios = require("axios");
const paymentHistoryModel = require("../models/paymentHistoryModel");
const paymentModel = require("../models/paymentModel");
const vehicleModel = require("../models/vehicleModel");
const walletModel = require("../models/walletModel");
const walletHistoryModel = require("../models/walletHistoryModel");
const notificationModel = require("../models/notificationModel");

async function CREATE_PAYMENT_HISTORY(payment) {
  try {
    const paymentHistory = new paymentHistoryModel({
      rider: payment.metadata.riderId,
      payment: payment.reference,
      vehicle: payment.metadata.vehicleId,
      payment_date: payment.createdAt,
      payment_amount: payment.amount / 100, // convert from kobo
      payment_status: payment.status,
    });
    await paymentHistory.save();
  } catch (error) {
    console.error(error);
  }
}

const paystack = new Paystack({
  secretKey: process.env.PAYSTACK_SECRET_KEY,
  publicKey: process.env.PAYSTACK_PUBLIC_KEY,
});

const INITIALIZE_PAYMENT = async (req, res) => {
  try {
    const { amount, email, riderId, vehicleId } = req.body;
    const response = await paystack.transaction.initialize({
      amount: amount * 100, // convert to kobo
      email,
      metadata: {
        riderId,
        vehicleId,
      },
    });
    res.send(response);
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
};

const VERIFY_PAYMENT = async (req, res) => {
  try {
    const { reference } = req.body;
    const response = await verificationPaymentFunction({
      reference,
    });
    if (response.status === "success") {
      await updatePaymentHistory(response.data);
    }
    res.send(response);
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
};

async function VERIFY_PAYMENT_FUNCTION({
  vehicle_id,
  userId,
  payment_type,
  payment,
  payment_amount,
}) {
  try {
    // get data from general settings
    let bike_down_amount_amount = 40000;
    // //verify payment
    // const response = await verificationPaymentFunction({
    //   reference: payment.reference,
    // });
    // return console.log({ response });
    // if (response.status === "success") {
    //   //  await updatePaymentHistory(response.data);
    //   return console.log({ response });
    // }

    // create the remain half has a payment tp be made
    const today = new Date();
    const sevenDaysFromToday = new Date(
      today.getTime() + 7 * 24 * 60 * 60 * 1000
    );
    // let payment_amount;
    if (payment_type === "half_payment") {
      // console.log({ today, sevenDaysFromToday });
      // create payment history for the half payment
      let returnedPayment = await CREATE_PAYMENT_FUNCTION({
        rider: userId,
        vehicle: vehicle_id,
        payment_amount: bike_down_amount_amount * 0.5,
        payment_due_date: today,
        description: "Half Down Payment",
        payment_status: "paid",
        overdue_charges: 0,
        payment,
      });
      let returnedPaymentHistory = await CREATE_PAYMENT_HISTORY_FUNCTION({
        rider: userId,
        vehicle: vehicle_id,
        payment_amount: bike_down_amount_amount * 0.5,
        description: "Half Down Payment",
        payment_status: "on_time",
        overdue_charges: 0,
        payment: returnedPayment._id,
      });
      // console.log({ today, sevenDaysFromToday });

      // create payment history for the half payment
      await CREATE_PAYMENT_FUNCTION({
        rider: userId,
        vehicle: vehicle_id,
        payment_amount: bike_down_amount_amount * 0.5,
        payment_due_date: sevenDaysFromToday,
        description: "Half Down Payment",
        payment_status: "pending",
        overdue_charges: 0,
        payment: null,
      });
    }
    if (payment_type === "full_payment") {
      console.log({ today, sevenDaysFromToday });

      // create the remain half has a payment tp be made
      await CREATE_PAYMENT_FUNCTION({
        rider: userId,
        vehicle: vehicle_id,
        payment_amount: bike_down_amount_amount,
        payment_due_date: today,
        description: "Full Down Payment",
        payment_status: "paid",
        overdue_charges: 0,
        payment,
      });
    }
  } catch (error) {
    console.log(error);
    console.log({
      okay: false,
      error: error.message,
      message: "Error verifying payment",
    });
    return false;
  }
}

async function CREATE_PAYMENT_FUNCTION({
  rider,
  vehicle,
  payment_amount,
  description,
  payment_status,
  overdue_charges,
  payment_due_date,
  payment,
}) {
  // console.log("CREATE_PAYMENT_FUNCTION", {
  //   rider,
  //   vehicle,
  //   payment_amount,
  //   description,
  //   payment_status,
  //   overdue_charges,
  //   payment_due_date,
  //   payment,
  // });
  const createdPayment = await paymentModel.create({
    payment_amount,
    payment: payment || null,
    vehicle,
    description,
    payment_due_date,
    rider,
    payment_status,
    payment_date: Date.now(),
    overdue_charges,
  });

  SEND_NOTIFICATION_FUNCTION(
    rider,
    `${
      payment_status.charAt(0).toUpperCase() + payment_status?.slice(1)
    } ₦${payment_amount} for ${description}`
  );

  const savedPayment = await createdPayment.save();
  return savedPayment;
}

async function CREATE_PAYMENT_HISTORY_FUNCTION({
  rider,
  vehicle,
  payment_amount,
  description,
  payment_status,
  overdue_charges,
  payment,
}) {
  console.log({ overdue_charges });
  const newPayment = await paymentHistoryModel.create({
    payment_amount,
    vehicle,
    description,
    rider,
    payment_status,
    payment_date: Date.now(),
    overdue_charges,
    payment,
  });
  SEND_NOTIFICATION_FUNCTION(
    rider,
    `Paid ₦${payment_amount} for ${description} ${
      overdue_charges > 0 ? "with ₦" + overdue_charges + " Overdue fee" : ""
    }`
  );

  return await newPayment.save();
}
// async function CREATE_PAYMENT_HISTORY_FUNCTION({
//   rider,
//   vehicle,
//   payment_amount,
//   description,
//   payment_status,
//   overdue_charges,
// }) {
//   if (!payment) {
//     throw Error("Payment History require payment ID");
//   }

//   const paymentHistory = await paymentHistoryModel.create({
//     payment: payment._id,
//     payment_amount,
//     vehicle,
//     description,
//     rider,
//     payment_date: Date.now(),
//     overdue_charges,
//   });

//   return await payment.save();
// }
const https = require("https");
const { SEND_NOTIFICATION_FUNCTION } = require("./notificationController");
// const vehicleModel = require("../models/vehicleModel");
async function verificationPaymentFunction({ reference }) {
  // const headers = {
  //   Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
  //   "Content-Type": "application/json",
  // };

  // const apiUrl = `https://api.paystack.co/transaction/verify/${reference}`; // Use template literals for cleaner code

  // axios
  //   .get(apiUrl, { headers }) // Remove params, as it's not needed in this case
  //   .then((response) => {
  //     return response; // Return the actual response data, not the entire response object
  //   })
  //   .catch((error) => {
  //     console.log({ error });
  //     return false;
  //   });

  const options = {
    hostname: "api.paystack.co",
    port: 443,
    path: `/transaction/verify/${reference}`, // Replace with the actual reference code
    method: "GET",
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`, // Use environment variable for secret key
      "Content-Type": "application/json", // Add Content-Type header
    },
  };

  https
    .request(options, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        console.log(JSON.parse(data));
      });
    })
    .on("error", (error) => {
      console.error(error);
    });
}


// async function CREDIT_VEHICLE_OWNERS() {
//   let activeVehicle = await vehicleModel.find({ active_vehicle: true, verified_vehicle: true, rider: { $ne: null } })

//   // console.log({ activeVehicle })

//   // map through and group the vehicles by vehicle_owner
//   //  credit the owners base on how many vehicle they hav, 1 = 13,000
//   // update owner wallet
//   // create wallet history
//   //  create notification
//   // send email to the  owner mail
// }


async function CREDIT_VEHICLE_OWNERS() {
  console.log("  CREDIT_VEHICLE_OWNERS()")
  const creditAmountPerVehicle = 13000;

  try {
    // Fetch active and verified vehicles with owners
    const activeVehicles = await vehicleModel.find({
      active_vehicle: true,
      verified_vehicle: true,
      rider: { $ne: null }
    });

    // Group vehicles by their owners
    const vehicleGroups = activeVehicles.reduce((acc, vehicle) => {
      const ownerId = vehicle.vehicle_owner.toString();
      if (!acc[ownerId]) {
        acc[ownerId] = [];
      }
      acc[ownerId].push(vehicle);
      return acc;
    }, {});

    // Process each owner and credit them based on vehicle count
    for (const [ownerId, vehicles] of Object.entries(vehicleGroups)) {
      const creditAmount = vehicles.length * creditAmountPerVehicle;

      // Update owner's wallet
      let wallet = await walletModel.findOne({ owner: ownerId });
      if (!wallet) {
        console.log(`Wallet not found for owner ${ownerId}`);
        continue;
      }

      const oldBalance = wallet.balance;
      wallet.balance += creditAmount;
      await wallet.save();

      // Create wallet history entry
      await walletHistoryModel.create({
        owner: ownerId,
        wallet: wallet._id,
        type: "credit",
        description: "Monthly vehicle credit",
        newBalance: wallet.balance,
        oldBalance,
        amount: creditAmount
      });

      // Create notification for the owner
      await notificationModel.create({
        message: `Your wallet has been credited with ${creditAmount.toLocaleString()} based on your active vehicles.`,
        user: ownerId
      });

      // Send email to the owner
      const emailContent = `
        <h3>Credit Notification</h3>
        <p>Dear Vehicle Owner,</p>
        <p>Your account has been credited with <b>${creditAmount.toLocaleString()}</b> based on your ${vehicles.length} active vehicles.</p>
        <p>New Balance: ${wallet.balance.toLocaleString() }</p>
        <p>Thank you for being a part of our service.</p>
      `;

      const ownerEmail = "owner@example.com"; // Replace with actual owner email retrieval logic
      // await sendEmail(ownerEmail, "Vehicle Credit Notification", emailContent);
    }
  } catch (error) {
    console.error("Error in CREDIT_VEHICLE_OWNERS:", error);
  }
}



module.exports = {
  CREATE_PAYMENT_HISTORY,
  INITIALIZE_PAYMENT,
  VERIFY_PAYMENT,
  VERIFY_PAYMENT_FUNCTION,
  CREATE_PAYMENT_FUNCTION,
  CREATE_PAYMENT_HISTORY_FUNCTION, CREDIT_VEHICLE_OWNERS
};
