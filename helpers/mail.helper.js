const nodemailer = require("nodemailer");

const transport = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    auth: {
      user: "75903e001@smtp-brevo.com",
      pass: "SMUs0WEJ59R6bpxj"
    }
  });

module.exports = transport

