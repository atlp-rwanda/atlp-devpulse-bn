import { gql } from "apollo-server";
const Schema = gql`
  type Trainee {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
  }

  type traineeAttribute {
    gender: String!
    birth_date: String!
    Address: String!
    phone: String!
    field_of_study: String!
    education_level: String!
    province: String!
    district: String!
    sector: String!
    cohort: String!
    isEmployed: String!
    isStudent: Boolean!
    Hackerrank_score: Int!
    english_score: Int!
    interview: Int!
    interview_decision: String!
    past_andela_programs: String!
    haveLaptop: String!
    trainee_id: String!
  }

  type Query {
    getTrainees: [Trainee]
    getTraineesAttribute: [traineeAttribute]
  }

  type Mutation {
    loadTrainees(spreadsheetId: String!): String!
  }
`;
export default Schema;
