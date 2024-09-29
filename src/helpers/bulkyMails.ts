import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";

dotenv.config();

const [email, API_KEY, name]: any = [
  "DEVPULSE_EMAIL",
  "API_KEY",
  "SENDER_NAME",
].map((e) => process.env[e]);

sgMail.setApiKey(API_KEY);

const sendBulkyEmail = async ({ params }: any) => {
  const { to, subject, html, cc, bcc } = params;
  const message: any = { from: { name, email }, to, subject, html, cc, bcc };
  try {
    await sgMail.send(message);
    return { status: "success", mail_res: "Email sent successfully!" };
  } catch (error: any) {
    return { status: "fail", mail_res: error.message };
  }
};

export default sendBulkyEmail;

export const sendUserCredentials = async (email: String, password: String) => {
  const loginUrl = `${process.env.LOGIN}/#/login`;
  const apikey: any = process.env.API_KEY;
  sgMail.setApiKey(apikey);
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        color: #333;
      }

      .container {
        background-color: #fff;
        border-radius: 8px;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
        padding: 20px;
        text-align: center;
      }

      h2 {
        color: #5157e0;
      }

      ul {
        list-style-type: none;
        padding: 0;
      }

      li {
        margin-bottom: 10px;
      }

      .login-button {
        text-decoration: none;
        background-color: #5157e0;
        color: #fff;
        padding: 10px 30px;
        border-radius: 4px;
        display: inline-block;
        margin-top: 20px;
        font-weight: bold;
        transition: background-color 0.3s ease;
      }
      .login-button:hover {
        background-color: #3e45b5;
      }
      span{
        color:white;
      }
    </style>
    </head>
    <body>
    <div class="container">
      <h2>Welcome to devpulse</h2>
      <p>Here are your login credentials:</p>
      <ul>
        <li>Email: ${email}</li>
        <li>Password: ${password}</li>
      </ul>
      <p>Click the button below to log in:</p>
      <a href="${loginUrl}" class="login-button"><span>Log In</span></a>
    </div>
    </body>
    </html>
  `;

  const message: any = {
    to: email,
    from: {
      email: process.env.DEVPULSE_EMAIL,
    },
    subject: "Your Login Credentials",
    html: htmlContent,
  };

  try {
    await sgMail.send(message);
    return { status: "success", mail_res: "Email sent successfully!" };
  } catch (error: any) {
    return { status: "fail", mail_res: error.message };
  }
};

export const sendEmailTemplate = async (email: string, subject: string, title: string, body: string, button: any) => {
  try {

    const contents = `
<!DOCTYPE html>
<html lang="en">

<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Dev pulse template</title>
<style>
  body {
    margin: 0;
    padding: 0;
    padding: 30px;
    color: #000;
  }

  .title {
    display: flex;
    flex-direction: row;
  }

  .title h2 {
    font-weight: bold;
  }

  .box p {
    width: 400px;
    font-size: 18px;
    color: #000;
  }
  .box .button {
    text-decoration: none;
    background: #56C870;
    color: #fff;
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
</style>
</head>

<body>
<div class="container">
  <div class="title">
    <h2>
      ${title}
    </h2>
  </div>
  <div class="box">
    <p>
     ${body}
    </p>
    <a href="${button.url}" class="button">
     ${button.text}
    </a>
  </div>
</div>
</div>
</body>
</html>
`
    const message: any = {
      to: email,
      from: {
        email: process.env.DEVPULSE_EMAIL
      },
      subject: `${subject} - Devpulse`,
      html: contents
    }
    await sgMail.send(message);
    return {
      status: "success",
      message: "Email sent successfully!"
    }
  }
  catch (error: any) {
    return {
      status: "fail",
      message: error.message
    }
  }
}







