import { gql } from "apollo-server";

const Schema = gql`
  type Query {
    getAllTraineeApplicant: [traineeApplicant]!
    getAllTraineeAtributes: [traineeAttribute]!
  }

  type traineeApplicant {
    _id: ID!
    firstName: String!
    lastName: String!
    email: String!
  }
  type traineeAttribute {
    gender: String!
    birth_date: String!
    Adress: String!
    phone: String!
    field_of_study: String!
    education_level: String!
    province: String!
    district: String!
    sector: String!
    isEmployed: Boolean!
    haveLaptop: Boolean!
    isStudent: Boolean!
    Hackerrank_score: String!
    english_score: String!
    interview: Int!
    interview_decision: String!
    past_andela_programs: String!
  }

  type Mutation {
    loadAllTrainees(spreadsheetId: String!): String!
  }
`;
export default Schema;
