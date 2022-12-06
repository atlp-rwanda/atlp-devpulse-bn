"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_1 = require("apollo-server");
const ResendDataSchema = (0, apollo_server_1.gql) `
  type Mutation {
    reSendDataIntoDb(columnData: columnsInputSubmitted!): String!
  }
  input columnsInputSubmitted {
    firstName: String!
    lastName: String!
    email: String!
    gender: String!
    birth_date: String!
    Address: String!
    phone: String!
    field_of_study: String!
    education_level: String!
    province: String!
    district: String!
    sector: String!
    isEmployed: String!
    haveLaptop: String!
    isStudent: String!
    Hackerrank_score: String!
    english_score: String!
    interview: String!
    interview_decision: String!
    past_andela_programs: String!
    spreadsheetId:String!
    cycle_name:String!
  }
`;
exports.default = ResendDataSchema;
