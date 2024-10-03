import { gql } from "apollo-server-express";

export const notificationTypedefs = gql`
  type Notification {
    _id: ID!
    message: String!
    type: String! # Example: 'new_application', 'application_status_update'
    createdAt: String!
    read: Boolean!
  }

  type Query {
    getAdminNotifications: [Notification!]!
  }

  type Mutation {
    markAdminNotificationAsRead(id: ID!): Notification
    deleteNotification(id: ID!): Boolean
  }
  type Subscription {
    notificationReceived: Notification!
  }
`;
