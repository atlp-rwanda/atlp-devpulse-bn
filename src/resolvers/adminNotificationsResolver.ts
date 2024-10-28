import Notification from "../models/adminNotificationsModels";
import { pusher } from "../helpers/pusher";

export const adminNotificationsResolver = {
  Query: {
    async getAdminNotifications() {
      return await Notification.find().select(
        "_id message read type createdAt"
      );
    },
  },
  Mutation: {
    async markAdminNotificationAsRead(_: any, { id }: { id: string }) {
      const notification = await Notification.findById(id);
      if (!notification) {
        throw new Error("Notification not found");
      }

      notification.read = true;
      const updatedNotification = await notification.save();

      return {
        _id: updatedNotification._id,
        message: updatedNotification.message,
        type: updatedNotification.type,
        createdAt: updatedNotification.createdAt,
        read: updatedNotification.read,
      };
    },
    async deleteNotification(_: any, { id }: { id: string }) {
      const notification = await Notification.findById(id);
      if (!notification) {
        throw new Error("Notification not found");
      }

      await Notification.deleteOne({ _id: id });
      return true;
    },
  },
};


export const publishNotification = async (message: string, type: string) => {
  const notification = new Notification({
    message,
    type,
    createdAt: new Date().toISOString(),
    read: false,
  });

  await notification.save();


  await pusher.trigger("admin-notifications", "new-notification", {
    message: notification.message,
    id: notification._id,
    createdAt: notification.createdAt,
    read: notification.read,
    type: notification.type,
  }).catch((error) => {
    console.error("Error with Pusher trigger for admin notification:", error);
  });
};
