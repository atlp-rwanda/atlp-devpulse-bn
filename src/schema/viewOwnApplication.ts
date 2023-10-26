import { gql } from 'apollo-server';

export const viewOwnApplicationTypeDefs = gql`
  enum ApplicationStatus {
    submitted
    received
    deleted
    withdrawn
    old
  }

  type Application {
    _id: ID!
    firstName: String!
    lastName: String!
    email: String!
    telephone: String!
    gender: String!
    resume: String!
    comments: String!
    address: String!
    availability_for_interview: String!
    status: ApplicationStatus!
    formUrl: String
    dateOfSubmission:String!
    associatedForm:Form!
  }
  type Form {
    _id: ID!
    title: String!
    description: String!
    link: String!
    jobpost:String
  }

  type ApplicationsResponse {
    applications: [Application!]!
    totalCount: Int!
  }

  input ApplicationFilter {
    status: [ApplicationStatus!]
  }

  input PaginationInput {
    page: Int!
    pageSize: Int!
  }

  input UpdateApplicationInput {
    firstName: String
    lastName: String
    telephone: String
    gender: String
    address: String
    resume: String
  }

  type Query {
    viewAllOwnApplications(filter: ApplicationFilter, pagination: PaginationInput): ApplicationsResponse
    viewOwnApplication(id: ID!): Application
  }

  type Mutation {
    updateOwnApplication(id: ID!, input: UpdateApplicationInput!): Application
  }
`;
