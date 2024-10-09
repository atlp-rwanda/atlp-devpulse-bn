import { gql } from "apollo-server-core";

export const formSchema = gql`
  type Application {
    id: ID!
    link: String!
    title: String!
    jobpost: String!
    description: String!
    spreadsheetlink: String!
    formrange: String!
  }

  type Query {
    getApplication(id: ID!): Application
    getAllApplications: [Application!]!
  }

  type Mutation {
    createApplication(
      link: String!
      title: String!
      jobpost: String!
      description: String!
      spreadsheetlink: String!
      formrange: String!
    ): Application
    deleteApplication(id: ID!): Application
    updateApplication(
      id: String!
      link: String!
      title: String!
      jobpost: String!
      description: String!
      spreadsheetlink: String!
      formrange: String!
    ): Application!
  }
`;
