import { LoggedUserModel } from "../models/AuthUser";
import BcryptUtil from '../utils/bcrypt'; 
import { ApolloError } from 'apollo-server-express';
import crypto from 'crypto';
import { sendEmailTemplate } from '../helpers/bulkyMails';  

export const passwordResolvers = {
  Mutation: {
    forgetPassword: async (_: any, { email }: { email: string }) => {
      try {
        const user = await LoggedUserModel.findOne({ email });
        if (!user) {
          throw new ApolloError('User not found');
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        user.resetToken = resetToken;
        user.resetTokenExpiration = new Date(Date.now() + 3600000); 
        await user.save();

        try {
          await sendEmailTemplate(
            email, 
            "Password Reset Request", 
            "Reset Your Password", 
            `You have requested to reset your password. Click the button below to reset it. If you did not request this, please ignore this email.`,
            { url: `${process.env.FRONTEND_URL}/#/reset-password?token=${resetToken}`, text: 'Reset Password' }
          );
         
          return true;
        } catch (emailError) {
          console.error('Error sending reset email:', emailError);
          throw new ApolloError('Failed to send reset email');
        }
      } catch (error) {
        console.error('Error in forgetPassword resolver:', error);
        if (error instanceof ApolloError) {
          throw error;
        }
        throw new ApolloError('Failed to process request');
      }
    },

    resetPassword: async (_: any, { token, newPassword }: { token: string; newPassword: string }) => {
      try {
        const user = await LoggedUserModel.findOne({
          resetToken: token,
          resetTokenExpiration: { $gt: Date.now() }, 
        });

        if (!user) {
          throw new ApolloError('Invalid or expired token');
        }

        user.password = BcryptUtil.hash(newPassword);
        user.resetToken = undefined;
        user.resetTokenExpiration = undefined; 
        await user.save();

        return { message: 'Password has been successfully reset.' };
      } catch (error) {
        console.error('Error in resetPassword resolver:', error);
        if (error instanceof ApolloError) {
          throw error;
        }
        throw new ApolloError('Failed to process request');
      }
    },
  },
};