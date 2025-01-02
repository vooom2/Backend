
const Mailgen = require("mailgen");
const { MailtrapClient } = require("mailtrap")


function sendMailFunction(mailObject) {
  console.log("first")
  const { receiverEmail, emailSubject, body, senderName } = mailObject;
  console.log("sendMailFunction");

  // const SENDER_EMAIL = "support@vooom.live";
  const SENDER_EMAIL = "support@tobs.ng";

  const client = new MailtrapClient({
    token: process.env.MAILTRAP_TOKEN,
    timeout: 30000, // 30 seconds timeout
  });

  const sender = { name: senderName || "Vooom Support", email: SENDER_EMAIL };

  // setup mailgen
  const MailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "Vooom",
      link: "https://vooom.live/",
      // Custom product logo URL (optional)
      // logo: "https://res.cloudinary.com/douhmck38/image/upload/v1688377091/PHOTO-2023-03-18-11-08-22_wasn96.jpg",
      // Custom logo height (optional)
      // logoHeight: "30px",
    },
  });

  const generateEmail = {
    body, // This is the body passed in the mailObject
  };

  const mail = MailGenerator.generate(generateEmail);

  return new Promise((resolve, reject) => {
    client
      .send({
        from: sender,
        to: [{ email: receiverEmail }],
        subject: emailSubject,
        html: mail,
      })
      .then((response) => {
        console.log("Email sent successfully:", response);
        resolve(response); // Resolve the promise with the response
      })
      .catch((error) => {
        console.error("Error sending email:", error.message);
        if (error.response) {
          console.error("Response error:", error.response.data);
        } else if (error.request) {
          console.error("Request error:", error.request);
        } else {
          console.error("General error:", error.message);
        }
        reject(error); // Reject the promise with the error
      });
  });
}


// sendMailFunction({
//   receiverEmail: "victorjosiahm3@gmail.com",
//   emailSubject: "OTP",
//   body: {
//     name: "User",
//     action: {
//       instructions:
//         "You are required to use this OTP to validate your Account",
//       button: {
//         color: "#f46702", // Optional action button color
//         text: `2j3h5`,
//       },
//     },
//     outro: [
//       "Do not disclose this OTP to anyone",
//       "Need help, or have questions?",
//       "Just reply to this email, we'd love to help.",
//     ],
//   },

// });

module.exports = {
  sendMailFunction,
};
