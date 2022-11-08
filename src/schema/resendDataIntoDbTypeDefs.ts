import { gql } from "apollo-server";

const ResendDataSchema = gql`
  type Mutation {
    reSendDataIntoDb(columnData: columnsInputSubmitted!): String!
  }
  input columnsInputSubmitted {
    firstName: String!
    lastName: String!
    email: String!
    gender: String!
    birth_date: String!
    Adress: String!
    phone: String!
    field_of_study: String!
    education_level: String!
    province: String!
    district: String!
    sector: String!
    cohort: String!
    isEmployed: String!
    haveLaptop: String!
    isStudent: String!
    Hackerrank_score: String!
    english_score: String!
    interview: String!
    interview_decision: String!
    past_andela_programs: String!
    spreadsheetId:String!
  }
`;
export default ResendDataSchema;
