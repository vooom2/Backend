const schedule = require("node-schedule");
const moment = require("moment");
const Rider = require("../models/riderModel");
const Payment = require("../models/paymentModel");
const {
  SEND_NOTIFICATION_FUNCTION,
} = require("../controllers/notificationController");
const Vehicle = require("../models/vehicleModel");
const {
  CREATE_PAYMENT_FUNCTION,
  CREDIT_VEHICLE_OWNERS,
} = require("../controllers/paymentController");
const {
  CREATE_INSPECTION_FUNCTION,
} = require("../controllers/vehicleController");
const inspectionModel = require("../models/inspectionModel");
const locationSpecsModel = require("../models/locationSpecsModel");

// Daily schedule
const dailyRule = new schedule.RecurrenceRule();
dailyRule.dayOfWeek = [0, 1, 2, 3, 4, 5, 6]; // Daily
dailyRule.hour = 0; // Midnight
dailyRule.minute = 0;

schedule.scheduleJob(dailyRule, async () => {
  console.log("Running daily job (every 60 seconds for testing)");
  // Update pending payments
  const payments = await Payment.find({});

  const pendingPayment = payments.filter((payment) => payment.payment === null);
  // console.log("pendingPayment:", pendingPayment.length)
  pendingPayment.forEach((payment) => {
    const createdAt = moment(payment.createdAt);
    // const dueDate = createdAt.add(7, 'days');
    const dueDate = createdAt.add(1, "hour");

    // console.log({ dueDate, isAfter: moment().isAfter(dueDate), createdAt })
    if (moment().isAfter(dueDate)) {
      let overdue_payment = 1000;
      // Update overdue charges
      payment.overdue_charges += 1000;
      payment.payment_status = "overdue";
      SEND_NOTIFICATION_FUNCTION(
        payment.rider,
        `You have been charged ₦${overdue_payment.toLocaleString()} for overdue payment`
      );
      payment.save();
    }
  });

  // Update rider ratings
  const riders = await Rider.find();
  riders.forEach((rider) => {
    const riderPayment = payments.filter(
      (payment) => `${payment.rider}` === `${rider._id}`
    );
    let paymentReliability = "Excellent";
    let defaultHistory = "Clean";
    // console.log({ riderPayment, payment: payments.length })
    // console.log("riderPayment length:", riderPayment.length)
    // console.log("riderPayment:", riderPayment")

    // Calculate payment reliability
    const paidOnTime = riderPayment.filter((payment) => {
      const createdAt = moment(payment.createdAt);
      // const dueDate = createdAt.add(7, 'days');
      const dueDate = createdAt.add(1, "hour");
      return moment(payment.createdAt).isSameOrBefore(dueDate);
    }).length;
    const totalPayments = riderPayment.length;
    const paymentReliabilityScore = Number((paidOnTime / totalPayments) * 100);
    // console.log({ paidOnTime, totalPayments, paymentReliabilityScore })
    if (paymentReliabilityScore < 60) {
      // If the rider's previous payment reliability is not "Poor", send notification
      if (rider.rider_rating.payment_reliability !== "Poor") {
        SEND_NOTIFICATION_FUNCTION(rider._id, `Payment Rating Changed to Poor`);
      }
      paymentReliability = "Poor";
    } else if (paymentReliabilityScore < 80) {
      // If the rider's previous payment reliability is not "Good", send notification
      if (rider.rider_rating.payment_reliability !== "Good") {
        SEND_NOTIFICATION_FUNCTION(rider._id, `Payment Rating Changed to Good`);
      }
      paymentReliability = "Good";
    } else {
      // If the rider's previous payment reliability is not "Excellent", send notification
      if (rider.rider_rating.payment_reliability !== "Excellent") {
        SEND_NOTIFICATION_FUNCTION(
          rider._id,
          `Payment Rating Changed to Excellent`
        );
      }
      paymentReliability = "Excellent";
    }

    // Update default history
    const defaultedPayments = riderPayment.filter(
      (payment) => payment.payment_status === "overdue"
    ).length;
    if (defaultedPayments > 0) {
      if (rider.rider_rating.default_history !== "Defaulted") {
        SEND_NOTIFICATION_FUNCTION(
          rider._id,
          `Payment default Changed to Defaulted`
        );
      }
      defaultHistory = "Defaulted";
    }
    // console.log({
    //   totalPayments,
    //   paymentReliabilityScore, paymentReliability, defaultedPayments, defaultHistory,
    //   payment_reliability: rider.rider_rating.payment_reliability
    // })

    // Update rider rating
    rider.rider_rating.payment_reliability = paymentReliability;
    rider.rider_rating.default_history = defaultHistory;
    rider.save();
  });
});

// Weekly schedule
const weeklyRule = new schedule.RecurrenceRule();
weeklyRule.dayOfWeek = 1; // Monday
weeklyRule.hour = 0; // Midnight
weeklyRule.minute = 0;

// Minutely schedule
const minutelyRule = new schedule.RecurrenceRule();
minutelyRule.second = 0; // Every minute at the start of the minute

// Hourly schedule
const hourlyRule = new schedule.RecurrenceRule();
hourlyRule.minute = 0; // Every hour at the start of the hour

schedule.scheduleJob(minutelyRule, async () => {
  console.log("Running weekly payments job ");
  // Get active vehicles
  const vehicles = await Vehicle.find({
    rider: { $ne: null },
    verified_vehicle: true,
    active_vehicle: true,
  });

  // Create payments for each vehicle
  vehicles.forEach(async (vehicle) => {
    const rider = vehicle.rider;
    const locationSpecs = await locationSpecsModel.findOne({
      name: vehicle.state,
    })

    return;

    const remittance = locationSpecs.remittance
    const paymentAmount = remittance; // Replace with actual amount
    const description = "Weekly payment for vehicle " + vehicle.plate_number; // Replace with actual description

    CREATE_PAYMENT_FUNCTION({
      rider,
      vehicle: vehicle._id,
      payment_amount: paymentAmount,
      description,
      payment_status: "pending",
      overdue_charges: 0,
      payment_due_date: moment().add(7, "days").toDate(),
      // payment_due_date: moment().add(1, "hour").toDate(),
    });
  });

  // CREDIT_VEHICLE_OWNERS();
});

// Create the recurrence rule for every two weeks
const biWeeklyRule = new schedule.RecurrenceRule();
biWeeklyRule.dayOfWeek = 1; // Monday
biWeeklyRule.hour = 0; // Midnight
biWeeklyRule.minute = 0;

// // weekly schedule (for testing, run every hour)
// const biWeeklyRule = new schedule.RecurrenceRule();
// biWeeklyRule.minute = 0; // Every hour at the 0th minute

// schedule.scheduleJob(biWeeklyRule, async () => {
//   console.log("Running bi-weekly job");

//   // Determine the current week and month
//   const now = moment();
//   const currentMonth = now.format("MMMM"); // e.g., "October"
//   const weekOfMonth = Math.ceil(now.date() / 7); // Get the week of the month (1-5)

//   // Determine if it's the first or second lap
//   const lapDescription = `${currentMonth}/${
//     weekOfMonth <= 2 ? "1st lap" : "2nd lap"
//   }`;

//   console.log(`Current Lap: ${lapDescription}`);

//   // Get active vehicles
//   const vehicles = await Vehicle.find({
//     rider: { $ne: null },
//     verified_vehicle: true,
//     active_vehicle: true,
//   });

//   // Create payments for each vehicle
//   vehicles.forEach((vehicle) => {
//     const rider = vehicle.rider;

//     CREATE_INSPECTION_FUNCTION({
//       rider,
//       vehicle: vehicle._id,
//       description: lapDescription,
//       status: "Pending",
//     });
//   });
// });

schedule.scheduleJob(dailyRule, async () => {
  const vehicles = await Vehicle.find({
    rider: { $ne: null },
    verified_vehicle: true,
    active_vehicle: true,
  });

  const riders = await Rider.find();
  riders.forEach(async (rider) => {
    const lastInspection = await inspectionModel
      .findOne({ rider: rider._id })
      .sort("-due_date")
      .limit(1);

    if (
      lastInspection &&
      lastInspection.due_date < new Date().setDate(new Date().getDate() - 1)
    ) {
      CREATE_INSPECTION_FUNCTION({
        rider: rider._id,
        vehicle: lastInspection.vehicle,
        description: lapDescription,
        status: "Pending",
        due_date: moment().add(14, "days").toISOString(),
      });
    }
  });

  // Create payments for each vehicle
});