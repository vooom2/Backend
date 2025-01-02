const notificationRoute = require("express").Router();
const Notification = require("../models/notificationModel");

notificationRoute.get("/", async (req, res) => {
  // const savedPayment = await newPayment.save();
  const { userId, accountType } = res.locals;
  try {
    // const notifications = await Notification.find();

    const notifications = await Notification.find({
      $or: [
        {
          user: "*",
        },
        {
          user: userId,
        },
      ],
    }).sort({ createdAt: -1 });
    if (!notifications)
      return res
        .status(404)
        .send({ ok: false, message: "notification not found" });
    return res.send({ ok: true, notifications });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      ok: false,
      message: "Server Error getting notification",
      error: `${error}.`,
    });
  }
});

notificationRoute.post("/", async (req, res) => {
  let { message, user } = req.body;

  const { userId, accountType } = res.locals;

  if (!message || message === "") {
    return res.status(400).send({
      ok: false,
      message: "Required status",
    });
  }

  // Create new user
  let newNotification = new Notification({
    message: message,
    user: user,
  });

  try {
    // Save user
    const savedNotification = await newNotification.save();
    res.status(200).json({ ok: true, notification: savedNotification });
  } catch (error) {
    // console.log(error);
    return res.status(500).send({
      ok: false,
      message: "Server Error saving notification",
      error: `${error}.`,
    });
  }
});

module.exports = notificationRoute;

// http://localhost:5000/api/payment/failed
