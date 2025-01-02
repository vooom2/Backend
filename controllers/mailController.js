const sendPaymentReminder = async (riderId, vehicleId) => {
  try {
    const rider = await Rider.findById(riderId);
    const vehicle = await Vehicle.findById(vehicleId);
    const paymentHistory = await PaymentHistory.find({
      rider: riderId,
      vehicle: vehicleId,
    });
    const nextPaymentDate =
      paymentHistory[0].payment_date + 7 * 24 * 60 * 60 * 1000; // 7 days
    const emailBody = `
      <h2>Payment Reminder</h2>
      <p>Dear ${rider.full_name},</p>
      <p>Your next payment for vehicle ${
        vehicle.license_plate
      } is due on ${new Date(nextPaymentDate).toLocaleDateString()}.</p>
      <p>Please make payment on time to avoid penalties.</p>
      <p>Best regards,</p>
      <p>[Your Company Name]</p>
    `;
    await sendEmail(rider.email, "Payment Reminder", emailBody);
  } catch (error) {
    console.error(error);
  }
};

const schedule = require("node-schedule");

const rule = new schedule.RecurrenceRule();
rule.dayOfWeek = [0, new schedule.Range(1, 6)]; // Monday to Saturday
rule.hour = 8; // 8am
rule.minute = 0;

schedule.scheduleJob(rule, async () => {
  // Find all riders with upcoming payments
  const riders = await Rider.find({ payments: { $ne: null } });
  riders.forEach((rider) => {
    const paymentHistory = rider.paymentHistory;
    const nextPaymentDate =
      paymentHistory[paymentHistory.length - 1].payment_date +
      7 * 24 * 60 * 60 * 1000; // 7 days
    if (new Date(nextPaymentDate) <= new Date()) {
      sendPaymentReminder(rider._id, paymentHistory.vehicle);
    }
  });
});

const nodemailer = require("nodemailer");

// Configuring the reusable mail sending function
async function sendEmail(to, subject, html) {
  const transporter = nodemailer.createTransport({
    service: "Gmail", // Update this if using a different service
    auth: {
      user: process.env.EMAIL_USERNAME, // environment variable for email username
      pass: process.env.EMAIL_PASSWORD, // environment variable for email password
    },
  });

  try {
    const info = await transporter.sendMail({
      from: '"Your Service Name" <your-email@example.com>', // sender address
      to, // recipient
      subject, // Subject line
      html, // HTML body content
    });
    console.log("Email sent: %s", info.messageId);
  } catch (error) {
    console.error("Error sending email: ", error);
  }
}

module.exports = { sendEmail };
