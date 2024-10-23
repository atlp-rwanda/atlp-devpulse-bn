import { gql } from "apollo-server";

const Schema = gql`
  type Notification {
    id: ID!
    userId: ID!
    message: String!
    read: Boolean!
    createdAt: String!
  }

  type Query {
    getNotifications(userId: ID!): [Notification!]!
  }

  type Mutation {
    createNotification(userId: ID!, message: String!): Notification!
    markNotificationAsRead(id: ID!): Notification!
  }
`;

export default Schema;
