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
                    <!-- Header -->
                    <tr>
                        <td style="padding: 40px 40px 20px 40px;">
                            <img src="/api/placeholder/120/40" alt="Company Logo" style="display: block; margin-bottom: 20px;">
                            <h1 style="margin: 0; font-size: 24px; color: #333333;">Password Reset Request</h1>
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
                                    <td style="background-color: #007bff; border-radius: 4px;">
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
                                <a href="${resetLink}" style="color: #007bff; word-break: break-all;">${resetLink}</a>
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