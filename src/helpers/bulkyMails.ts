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


export const sendEmailTemplate = async (
  email: string,
  subject: string,
  title: string,
  body: string,
  button?: { url: string, text: string }
) => {
  try {
    const logoText = "DevPulse";
    const mainColor = "#374151";
    const secondaryColor = "#56C870";

    const generateLogo = (logo: string, color: string) => {
      return `
        <div style="margin-bottom: 20px;">
          <span style="font-size: 36px; font-weight: bold; color: ${color};text-align: center;">${logo}</span>
        </div>
      `;
    };

    const generateTitle = (title: string) => {
      return `<h2 style="color: ${mainColor}; font-size: 28px; margin-bottom: 20px;">${title}</h2>`;
    };

    const generateBody = (body: string) => {
      return `<p style="color: #555; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">${body}</p>`;
    };

    const generateButton = (url: string, text: string) => {
      return `
        <div style="margin-bottom: 30px;">
          <a href="${url}" style="display: inline-block; padding: 12px 24px; background-color: ${secondaryColor}; color: white; text-decoration: none; border-radius: 5px; font-size: 16px;">
            ${text}
          </a>
        </div>
      `;
    };

    const generateSocialIcons = () => {
      return `
        <div style="margin-top: 40px;">
          <a href="https://facebook.com/yourpage" style="margin: 0 10px;">
            <img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" alt="Facebook" style="width: 24px; height: 24px;">
          </a>
          <a href="https://twitter.com/yourpage" style="margin: 0 10px;">
            <img src="https://cdn-icons-png.flaticon.com/512/733/733579.png" alt="Twitter" style="width: 24px; height: 24px;">
          </a>
          <a href="https://linkedin.com/yourpage" style="margin: 0 10px;">
            <img src="https://cdn-icons-png.flaticon.com/512/145/145807.png" alt="LinkedIn" style="width: 24px; height: 24px;">
          </a>
        </div>
      `;
    };

    const generateFooterLogo = () => {
      return `
        <div style="margin-top: 80px;">
          <p style="color: #555; font-size: 14px;">
            If you received this email by mistake, simply ignore it. <br />
            For any questions, contact us at <a href="mailto: samuel.nishimwe@andela.com" style="color: ${secondaryColor};">samuel.nishimwe@andela.com</a>.
          </p>
          <a href="" style="margin: 0 10px; display: inline-flex; align-items: center; text-decoration: none;">
            <img 
              src="https://res.cloudinary.com/dpu6ljn5c/image/upload/f_auto,q_auto/i8tsuw2gcwsyzze2jyyj" 
              alt="Devpulse Logo" 
              style="width: 30px; height: 30px; margin-right: 10px;"
            >
            <h4 style="color: ${mainColor}; font-size: 24px; margin: 0; font-family: Arial, sans-serif;">
              Devpulse
            </h4>
          </a>
        </div>
      `;
    };

    const generateFooter = () => {
      return `
        <div style="margin-top: 40px;font-size: 12px; color: #999;">
          <p>&copy; 2024 DevPulse. All rights reserved.</p>
          <p><a href="https://devpulse.com/unsubscribe" style="color: #999; text-decoration: underline;">Unsubscribe</a></p>
        </div>
      `;
    };

    const contents = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="description" content="Stay updated with the latest from DevPulse">
        <title>${subject}</title>
        <style>
          body {
            font-family: 'Arial', sans-serif;
            background-color: #f9fafb;
            color: #333;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: white;
            border-radius: 10px;
            padding: 30px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
            margin-top: 30px;
          }
          a {
            text-decoration: none;
          }
          h2 {
            color: ${mainColor};
            font-size: 28px;
            margin-bottom: 20px;
          }
          p {
            font-size: 16px;
            line-height: 1.6;
            color: #555;
            margin-bottom: 20px;
          }
          .button {
            display: inline-block;
            background-color: ${secondaryColor};
            color: white;
            padding: 12px 24px;
            border-radius: 5px;
            text-decoration: none;
            font-size: 16px;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="container">
          ${generateLogo(logoText, mainColor)}
          ${generateTitle(title)}
          ${generateBody(body)}
          ${button ? generateButton(button.url, button.text) : ''}
          ${generateFooterLogo()}
          ${generateSocialIcons()}
          ${generateFooter()}
        </div>
      </body>
    </html>
    `;

    const message: any = {
      to: email,
      from: {
        email: process.env.DEVPULSE_EMAIL,
      },
      subject: `${subject}`,
      html: contents,
    };

    await sgMail.send(message);

    return {
      status: "success",
      message: "Email sent successfully!",
    };
  } catch (error: any) {
    return {
      status: "fail",
      message: error.message,
    };
  }
};
