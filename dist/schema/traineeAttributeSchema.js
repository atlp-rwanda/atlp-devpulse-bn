"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeDefsAttribute = void 0;
const apollo_server_1 = require("apollo-server");
exports.typeDefsAttribute = (0, apollo_server_1.gql) `
  type Query {
    allTraineesDetails(input: pagination): [traineeAttribute]
    getOneTraineeAllDetails(input: one): traineeAttribute
  }
  type Mutation {
    createTraineeAttribute(
      attributeInput: traineeAttributeInput
    ): traineeAttributeCreated
    updateTraineeAttribute(
      ID: ID!
      attributeUpdateInput: traineeUpdateAttributeInput
    ): traineeAttributeCreated
  }
  input one {
    id: ID!
  }
  input traineeAttributeInput {
    gender: String!
    birth_date: String!
    Address: String!
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
    interview_decision: String!
    past_andela_programs: String!
    trainee_id: String!
  }
  input pagination {
    page: Int!
    itemsPerPage: Int
    All: Boolean
  }

  input traineeUpdateAttributeInput {
    gender: String
    birth_date: String
    Address: String
    phone: String
    field_of_study: String
    education_level: String
    province: String
    district: String
    sector: String
    isEmployed: Boolean
    haveLaptop: Boolean
    isStudent: Boolean
    Hackerrank_score: String
    english_score: String
    interview_decision: String
    past_andela_programs: String
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
    isEmployed: Boolean!
    haveLaptop: Boolean!
    isStudent: Boolean!
    Hackerrank_score: String!
    english_score: String!
    interview_decision: String!
    past_andela_programs: String!
    _id: ID
    trainee_id: traineeApplicant!
  }

  type traineeAttributeCreated {
    gender: String!
    birth_date: String!
    Address: String!
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
    interview_decision: String!
    past_andela_programs: String!
    _id: ID
    trainee_id: String!
  }
`;
