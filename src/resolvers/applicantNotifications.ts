import { ApplicantNotificationsModel } from "../models/applicantNotifications";

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
      try {
        const newNotification = new ApplicantNotificationsModel({
          userId: args.userId,
          message: args.message,
          eventType: args.eventType,
        });
        const savedNotification = await newNotification.save();

        return savedNotification;
      } catch (error) {
        console.error("Error in createNotification:", error);
        throw new Error("Failed to create notification");
      }
    },
    async markNotificationAsRead(_parent: any, args: { id: string }) {
      const notification = await ApplicantNotificationsModel.findById(args.id);
      if (!notification) {
        throw new Error("Notification not found");
      }
      const updatedNotification =
        await ApplicantNotificationsModel.findByIdAndUpdate(
          args.id,
          { read: !notification.read },
          { new: true }
        );

      return updatedNotification;
    },
  },
};

export default notificationResolver;
