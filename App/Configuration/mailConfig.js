const nodemailer = require("nodemailer");
require("dotenv").config(); // make sure this is at the top

const transporter = nodemailer.createTransport({
   host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === "true", // convert string to boolean
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

module.exports={transporter}
