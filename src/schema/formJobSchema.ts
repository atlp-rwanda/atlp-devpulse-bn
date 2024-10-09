import { gql } from "apollo-server-core";

export const formJobSchema = gql`
  type JobPostApplication {
    id: ID!
    program: Program
    cycle: applicationCycle
    cohort: cohort
    link: String!
    spreadsheetlink: String
    formrange: String
    title: String!
    description: String!
    label: String
    published: Boolean
  }
  type Count {
    total: Int!
  }

  input PostFilter {
    program: String
    cycle: String
    cohort: String
  }
  type Query {
    getJobApplication(id: ID!): JobPostApplication
    getAllJobApplication(
      input: pagination
      filter: PostFilter
    ): [JobPostApplication!]!
    filterJobDetails(input: FilterOptions): [JobPostApplication]
    getAllJobAttributescount: Count!
  }
  input jobInput {
    title: String
    program: String!
    cohort: String!
    cycle: String!
    description: String!
    label: String!
  }
  input jobUpdate {
    title: String
    program: String
    cohort: String
    cycle: String
    link: String
    spreadsheetlink: String
    formrange: String
    description: String
    label: String
    published: Boolean
  }
  input FilterOptions {
    page: Int!
    itemsPerPage: Int
    All: Boolean
    wordEntered: String
    filterAttribute: String
  }
  type Mutation {
    createJobApplication(jobFields: jobInput): JobPostApplication
    deleteJobApplication(id: ID!): String!
    updateJobApplication(id: String, jobFields: jobUpdate): JobPostApplication!
  }
`;
