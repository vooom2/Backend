const Notification = require("../models/notificationModel");

async function SEND_NOTIFICATION_FUNCTION(uId, message) {
  // console.log("SEND_NOTIFICATION_FUNCTION: ", message)
  // send notification to ambassadors
  if (message === "") {
    return;
  }
  let newNotification = new Notification({
    user: uId,
    message: message,
  });
  // save notification
  await newNotification.save();
}

module.exports = {
  SEND_NOTIFICATION_FUNCTION,
};
