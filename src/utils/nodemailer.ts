import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendPasswordResetEmail = async (email: string, resetToken: string) => {
  const baseUrl = process.env.BASE_URL;
  const resetLink = `${baseUrl}/#/reset-password?token=${resetToken}`;
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Password Reset Request',
    text: `Please use the following link to reset your password: ${resetLink}`,
    html: `
   <!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
        <tr>
            <td style="padding: 20px 0;">
                <table align="center" width="600" cellspacing="0" cellpadding="0" border="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                  
                    <tr>
                        <td style="padding: 40px 40px 20px 40px;">
                          
                            <table cellspacing="0" cellpadding="0" border="0" style="display: inline-block;">
                                <tr>
                                    <td style="display: flex; align-items: center;">
                                        
                                        <svg width="61" height="35" viewBox="0 0 61 35" fill="none" xmlns="http://www.w3.org/2000/svg" style="display: inline-block; vertical-align: middle; margin-right: 10px;">
                                            <circle cx="9.5" cy="18" r="5" stroke="#173B3F" stroke-width="2"/>
                                            <path d="M13.5 18.1112H18.3947C18.8216 18.1112 19.2014 17.8402 19.3403 17.4365L21.0407 12.4929C21.3631 11.5554 22.7064 11.6081 22.9545 12.5679L27.5058 30.1783C27.7791 31.2358 29.3076 31.152 29.4637 30.071L32.9434 5.97482C33.105 4.85579 34.7082 4.82253 34.916 5.93389L38.7307 26.3289C38.9122 27.2991 40.2404 27.4476 40.6317 26.5415L44.0115 18.7148C44.1697 18.3484 44.5306 18.1112 44.9296 18.1112H49.5" stroke="#173B3F" stroke-width="5"/>
                                            <circle cx="54.5" cy="18" r="5" stroke="#173B3F" stroke-width="2"/>
                                        </svg>
                                      
                                        <span style="font-family: 'Arial', sans-serif; font-weight: bold; font-size: 24px; color: #173B3F; vertical-align: middle;">
                                            PULSE
                                        </span>
                                    </td>
                                </tr>
                            </table>
                            <!-- Password Reset Header -->
                            <h1 style="margin: 20px 0 0 0; font-size: 24px; color: #173B3F;">Password Reset Request</h1>
                        </td>
                    </tr>
                    <!-- Content -->
                    <tr>
                        <td style="padding: 0 40px 20px 40px;">
                            <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.5; color: #555555;">
                                We received a request to reset the password for your account. If you didn't make this request, you can safely ignore this email.
                            </p>
                            <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.5; color: #555555;">
                                To reset your password, click the button below:
                            </p>
                        </td>
                    </tr>
                    <!-- Button -->
                    <tr>
                        <td style="padding: 0 40px 40px 40px;">
                            <table align="center" cellspacing="0" cellpadding="0" border="0">
                                <tr>
                                    <td style="background-color: #173B3F; border-radius: 4px;">
                                        <a href="${resetLink}" target="_blank" style="display: inline-block; padding: 12px 24px; font-size: 16px; color: #ffffff; text-decoration: none;">Reset Password</a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <!-- Additional Info -->
                    <tr>
                        <td style="padding: 0 40px 20px 40px; border-top: 1px solid #eeeeee;">
                            <p style="margin: 20px 0; font-size: 14px; line-height: 1.5; color: #999999;">
                                This password reset link will expire in 1 hour for security reasons.
                            </p>
                            <p style="margin: 0; font-size: 14px; line-height: 1.5; color: #999999;">
                                If the button doesn't work, copy and paste this link into your browser:
                                <br>
                                <a href="${resetLink}" style="color: #173B3F; word-break: break-all;">${resetLink}</a>
                            </p>
                        </td>
                    </tr>
                    <!-- Footer -->
                    <tr>
                        <td style="padding: 20px 40px; background-color: #f8f9fa; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;">
                            <p style="margin: 0; font-size: 14px; line-height: 1.5; color: #999999; text-align: center;">
                                If you didn't request a password reset, please ignore this email or contact support if you have concerns.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `,
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        reject(error);
      } else {
        console.log('Email sent:', info.response);
        resolve(info);
      }
    });
  });
};