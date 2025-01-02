require("dotenv").config();
const sendMail = require("express").Router();
const { sendMailFunction } = require("../middleware/Mail");
const Otp = require("../models/otpModal");


function generateOTP() {
  // Declare a digits variable
  // which stores all digits
  var digits = "0123456789";
  let OTP = "";
  for (let i = 0; i < 4; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
}
sendMail.post("/otp", async (req, res) => {
  const { to } = req.body;

  if (!to) {
    return res.send({
      ok: false,
      message: "Mail required fields is not provided",
    });
  }
  if (to === "") {
    return res.send({ ok: false, message: "Mail required fields is empty" });
  }
  // console.log({ to })

  let emailSubject;
  const otp = generateOTP();
  emailSubject = "Account OTP";

  try {
    const checkOtp = await Otp.findOne({ otp: otp });
    if (checkOtp !== null)
      return res.status(400).send({
        ok: false,
        message: "otp Already exist with this Email",
      });
    let otpObject = new Otp({
      to: to,
      otp: otp,
    });

    // console.log(otpObject);
    // return;
    const newOtp = await otpObject.save();

    // {
    // Read MailGen Doc to structure massage body
    // https://www.npmjs.com/package/mailgen
    // }

    await sendMailFunction({
      receiverEmail: to,
      emailSubject,
      body: {
        name: "User",
        action: {
          instructions:
            "You are required to use this OTP to validate your Account",
          button: {
            color: "#f46702", // Optional action button color
            text: `${otp}`,
          },
        },
        outro: [
          "Do not disclose this OTP to anyone",
          "Need help, or have questions?",
          "Just reply to this email, we'd love to help.",
        ],
      },
      others: {
        res,
      },
    });

    res.send(JSON.stringify({ ok: true, otp: otp }));
  } catch (error) {
    console.log({ error })
    res
      .status(500)
      .send({ ok: false, message: "error ", error: error.message });
  }
});

sendMail.post("/welcome", async (req, res) => {
  const { to, name } = req.body;

  if (!to) {
    return res.send({
      ok: false,
      message: "Mail required fields is not provided",
    });
  }
  if (to === "") {
    return res.send({ ok: false, message: "Mail required fields is empty" });
  }

  let emailSubject;
  emailSubject = "Welcome Message";

  try {
    // {
    // Read MailGen Doc to structure massage body
    // https://www.npmjs.com/package/mailgen
    // }
    await sendMailFunction({
      receiverEmail: to,
      emailSubject,
      body: {
        name: name,
        intro: [
          "Welcome to Tobs, your go-to gift-giving app!",
          "We're excited to help you spread love and joy, one gift at a time!",
          `<b>Get started:</b><br>
      - Explore our curated gift collections<br>
      - Send gifts instantly to loved ones<br>
      - Earn rewards and discounts<br>`
        ],
        outro: [
          "If you have any questions, comments, or feedback, please don't hesitate to contact us. We would love to hear from you.",
          "Thank you for choosing TOBs.",
        ],
      },
    });

    res.send({ ok: true });
  } catch (error) {
    res.status(500).send({ ok: false, message: "error ", error });
  }
});
module.exports = sendMail;
