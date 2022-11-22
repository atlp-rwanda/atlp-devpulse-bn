// @ts-ignore
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const [from, pass] = ["DEVPULSE_EMAIL", "DEVPULSE_PASSWORD"].map(
  (e) => process.env[e]
);

function sendBulkyEmail({ params }: any) {
  const { to, subject, html } = params;

  var mailformat = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!(to.toLowerCase().match(mailformat))) {
    return { "status": "fail", "data": "Please, enter a valid email" }
  } 

  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: { user: from, pass },
  });

  let mailOptions = { from, to, subject, html };
  let exp_response = true;

  transporter.sendMail(mailOptions, (error: any, res: any) => {
    if (error) {
      exp_response = false;
      return { "status": "fail", "data": error.message };
    }
  });

  if (exp_response === true) {
    return { "status": "success", "data": "Sent successfully" };
  }
}

export default sendBulkyEmail;
