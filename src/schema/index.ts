import { gql } from "apollo-server";
const Schema = gql`
  type Trainee {
    id: ID!
    firstName: String!
    lastName: String!
    gender: String!
    email: String!
    age: Int!
    fieldOfStudy: String!
    highOrCurrentEducation: String!
    province: String!
    district: String!
    cohort: String!
    employmentStatus: String!
    isStudent: Boolean!
    hackerrankScore: Int!
    englishScore: Int!
    interview: Int!
    decision: String!
    pastAndela: String!
  }

  input createTrainee {
    firstName: String!
    lastName: String!
    gender: String!
    email: String!
    age: Int!
    fieldOfStudy: String!
    highOrCurrentEducation: String!
    province: String!
    district: String!
    cohort: String!
    employmentStatus: String!
    isStudent: Boolean!
    hackerrankScore: Int!
    englishScore: Int!
    interview: Int!
    decision: String!
    pastAndela: String!
  }

  type Query {
    getTrainees: [Trainee]
  }

  type Mutation {
    loadTrainees(spreadsheetId: ID!): String!
  }
`;
export default Schema;
// loadTraineeResolver: any
// (sheetId: ID!): [Trainee!]!
