import { gql } from "apollo-server";
export const typeDefsAttribute = gql`
  type Query {
    allTraineesAttribute(input: pagination): [traineeAttribute]
    getOneTraineeAllDetails(id: ID!): traineeAttribute
  }
  type Mutation {
    createTraineeAttribute(
      input: traineeAttributeInput
    ): traineeAttributeCreated
    updateTraineeAttribute(input: traineeAttributeInput): traineeAttribute
  }
  input pagination {
    page: Int!
    itemsPerPage: Int
    All: Boolean
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
    cycle: String!
    isEmployed: Boolean!
    haveLaptop: Boolean!
    isStudent: Boolean!
    Hackerrank_score: String!
    english_score: String!
    interview_decision: String!
    past_andela_programs: String!
    trainee_id: String!
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
    cycle: String!
    isEmployed: Boolean!
    haveLaptop: Boolean!
    isStudent: Boolean!
    Hackerrank_score: String!
    english_score: String!
    interview_decision: String!
    past_andela_programs: String!
    _id: ID
    trainee_id: traineeApplicant
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
    cycle: String!
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
