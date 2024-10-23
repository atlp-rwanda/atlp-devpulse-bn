import { gql } from "apollo-server";
export const typeDefsAttribute = gql`
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
    understandTraining: Boolean
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
    understandTraining: Boolean
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
    understandTraining: Boolean
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
    understandTraining: Boolean
    _id: ID
    trainee_id: String!
  }
  
  type TraineeApplicant {
    _id: ID!
    lastName: String!
    firstName: String!
    email: String!
    cycle_id: ApplicationCycle
    delete_at: Boolean
    status: String!
  }

  type ApplicationCycle {
    _id: ID!
    # Add other fields as needed
  }
`;