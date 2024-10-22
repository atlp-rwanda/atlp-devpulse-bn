import { gql } from "apollo-server-core";

export const ticketSchema = gql`
  type Ticket {
    id: ID!
    title: String!
    body: String!
    status: TicketStatus!
    author: User!
    createdAt: String!
    updatedAt: String!
    adminResponse: AdminResponse
  }

  type User {
    id: String
    firstName: String
    lastName: String
    email: String
  }

  type AdminResponse {
    id: ID!
    body: String!
    respondedAt: String!
  }

  enum TicketStatus {
    Open
    AdminReply
    ApplicantReply
    Resolved
  }

  type Query {
    getAllTickets: [Ticket!]!
    getTicketById(id: ID!): Ticket
    getUserTickets: [Ticket!]!
  }

  type Mutation {
    createTicket(title: String!, body: String!): Ticket!
    updateTicket(id: ID!, title: String, body: String): Ticket!
    resolveTicket(id: ID!, adminResponse: String!): Ticket!
  }
`;
