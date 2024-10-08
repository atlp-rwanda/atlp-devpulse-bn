import Notification from "../models/adminNotification";
import { LoggedUserModel } from "../models/AuthUser";
import { AuthenticationError } from "apollo-server-express";
import { PubSub } from "graphql-subscriptions";
const pubsub = new PubSub();
const NOTIFICATION_RECEIVED = "NOTIFICATION_RECEIVED";
export const notificationResolvers = {
  Query: {
    async getAdminNotifications() {
      return await Notification.find().select(
        "_id message read type createdAt"
      );
    },
  },
  Mutation: {
    async markNotificationAsRead(_: any, { id }: { id: string }) {
      const notification = await Notification.findById(id);
      if (!notification) {
        throw new Error("Notification not found");
      }

      notification.read = true;
      const updatedNotification = await notification.save();

      // Return the updated notification instead of all notifications
      return updatedNotification;
    },
    async deleteNotification(_: any, { id }: { id: string }) {
      const notification = await Notification.findById(id);
      if (!notification) {
        throw new Error("Notification not found");
      }

      await Notification.deleteOne({ _id: id });
      return true; // Return true to indicate success
    },
  },
  Subscription: {
    notificationReceived: {
      subscribe: () => pubsub.asyncIterator([NOTIFICATION_RECEIVED]),
    },
  },
};
export const publishNotification = async (message: any, type: any) => {
  const notification = new Notification({
    message,
    type,
    createdAt: new Date().toISOString(),
    read: false,
  });

  await notification.save();

  pubsub.publish(NOTIFICATION_RECEIVED, { notificationReceived: notification });
};
