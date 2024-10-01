import { LoggedUserModel } from "../models/AuthUser";
import { sendPasswordResetEmail } from '../utils/nodemailer'; 
import BcryptUtil from '../utils/bcrypt'; 
import { ApolloError } from 'apollo-server-express';
import crypto from 'crypto';

export const passwordResolvers = {
  Mutation: {
    forgetPassword: async (_: any, { email }: { email: string }) => {
      try {
        const user = await LoggedUserModel.findOne({ email });
        if (!user) {
          console.log(`User not found for email: ${email}`);
          throw new ApolloError('User not found');
        }

        const resetToken = crypto.randomBytes(32).toString('hex');

        user.resetToken = resetToken;
        user.resetTokenExpiration = new Date(Date.now() + 3600000); // 1 hour expiry
        await user.save();

        try {
          await sendPasswordResetEmail(email, resetToken);
          console.log(`Password reset email sent to ${email}`);
          return true;
        } catch (emailError) {
          console.error('Error sending reset email:', emailError);
          throw new ApolloError('Failed to send reset email');
        }
      } catch (error) {
        console.error('Error in forgetPassword resolver:', error);
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
          console.log(`Invalid or expired token: ${token}`);
          throw new ApolloError('Invalid or expired token');
        }

        user.password = BcryptUtil.hash(newPassword);
        user.resetToken = undefined;
        user.resetTokenExpiration = undefined; 
        await user.save();

        console.log(`Password has been reset for user: ${user.email}`);
        return { message: 'Password has been successfully reset.' };
      } catch (error) {
        console.error('Error in resetPassword resolver:', error);
        throw new ApolloError('Failed to reset password');
      }
    },
  },
};
