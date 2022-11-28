import sendmailer from "@sendgrid/mail";
import dotenv from "dotenv";

dotenv.config();

const [email, API_KEY, name]: any = [
  "DEVPULSE_EMAIL",
  "API_KEY",
  "SENDER_NAME",
].map((e) => process.env[e]);

sendmailer.setApiKey(API_KEY);

const sendBulkyEmail = async ({ params }: any) => {
  const { to, subject, html, cc, bcc } = params;

  const message: any = { from: { name, email }, to, subject, html, cc, bcc };

  try {
    const msgSent = await sendmailer.send(message);
    if (msgSent) {
      return { status: "success", mail_res: "Email sent successfully!" };
    } else {
      return { status: "success", mail_res: "Sorry, Please try again!" };
    }
  } catch (error: any) {
    return { status: "fail", mail_res: error.message };
  }
};

export default sendBulkyEmail;
