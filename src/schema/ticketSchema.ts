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
    firstname: String
    lastname: String
    email: String
  }

  type AdminResponse {
    id: ID!
    body: String!
    respondedAt: String!
    respondedBy: User!
  }

  enum TicketStatus {
    Open
    AdminReply
    ApplicantReply
    Resolved
  }

  type Count {
    total: Int!
  }

  input FilterOptions {
    page: Int!
    itemsPerPage: Int
    All: Boolean
    wordEntered: String
    filterAttribute: String
  }

  input TicketInput {
    title: String!
    body: String!
  }

  input UpdateTicketInput {
    id: ID!
    title: String
    body: String
  }


  type Query {
    getAllTickets: [Ticket!]!
    getTicketById(id: ID!): Ticket
    getUserTickets: [Ticket!]!
    filterTicketDetails(input: FilterOptions): [Ticket]
		getAllTicketAttributescount: Count!
  }

  type Mutation {
    createTicket(title: String!, body: String!): Ticket!
    updateTicket(id: ID!, title: String, body: String): Ticket!
    resolveTicket(id: ID!, adminResponse: String!): Ticket!
  }
`;
