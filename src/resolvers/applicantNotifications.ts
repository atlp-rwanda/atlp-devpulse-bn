import { ApplicantNotificationsModel } from "../models/applicantNotifications";
import io from "../helpers/webSocketServer"

const notificationResolver: any = {
  Query: {
    async getNotifications(_parent: any, args: { userId: string }) {
      return await ApplicantNotificationsModel.find({ userId: args.userId });
    },
  },
  Mutation: {
    async createNotification(
      _parent: any,
      args: { userId: string; message: string; eventType: string }
    ) {
      const newNotification = new ApplicantNotificationsModel({
        userId: args.userId,
        message: args.message,
        eventType: args.eventType,
      });
      const savedNotification = newNotification.save();

      io.to(args.userId).emit('newNotification', savedNotification)
      return savedNotification
    },
    async markNotificationAsRead(_parent: any, args: { id: string }) {
      return await ApplicantNotificationsModel.findByIdAndUpdate(
        args.id,
        { read: true },
        { new: true }
      );
    },
  },
};

export default notificationResolver;
