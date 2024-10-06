import { gql } from "apollo-server";

export const typeDefsAttribute = gql`
  type Query {
    allTraineesDetails(input: Pagination): [TraineeAttribute]
    getOneTraineeAllDetails(input: One): TraineeAttribute
  }

  type Mutation {
    createTraineeAttribute(
      attributeInput: TraineeAttributeInput
    ): TraineeAttributeCreated
    updateTraineeAttribute(
      ID: ID!
      attributeUpdateInput: TraineeUpdateAttributeInput
    ): TraineeAttributeCreated
  }

  input One {
    id: ID!
  }

  input TraineeAttributeInput {
    gender: String
    birth_date: String
    address: String
    phone: String
    study: Boolean
    education_level: String
    currentEducationLevel: String
    nationality: String
    province: String
    district: String
    sector: String
    isEmployed: Boolean
    haveLaptop: Boolean
    isStudent: Boolean
    Hackerrank_score: String
    english_score: String
    interview: Int
    interview_decision: String
    applicationPost: String
    otherApplication: String
    andelaPrograms: String
    otherPrograms: String
    understandTraining: Boolean
    discipline: String
    trainee_id: ID!
  }

  input Pagination {
    page: Int!
    itemsPerPage: Int
    All: Boolean
  }

  input TraineeUpdateAttributeInput {
    gender: String
    birth_date: String
    address: String
    phone: String
    study: Boolean
    education_level: String
    currentEducationLevel: String
    nationality: String
    province: String
    district: String
    sector: String
    isEmployed: Boolean
    haveLaptop: Boolean
    isStudent: Boolean
    Hackerrank_score: String
    english_score: String
    interview: Int
    interview_decision: String
    applicationPost: String
    otherApplication: String
    andelaPrograms: String
    otherPrograms: String
    understandTraining: Boolean
    discipline: String
  }

  type TraineeAttribute {
    _id: ID
    gender: String
    birth_date: String
    address: String
    phone: String
    study: Boolean
    education_level: String
    currentEducationLevel: String
    nationality: String
    province: String
    district: String
    sector: String
    isEmployed: Boolean
    haveLaptop: Boolean
    isStudent: Boolean
    Hackerrank_score: String
    english_score: String
    interview: Int
    interview_decision: String
    applicationPost: String
    otherApplication: String
    andelaPrograms: String
    otherPrograms: String
    understandTraining: Boolean
    discipline: String
    trainee: TraineeApplicant!
  }

  type TraineeAttributeCreated {
    _id: ID
    gender: String
    birth_date: String
    address: String
    phone: String
    study: Boolean
    education_level: String
    currentEducationLevel: String
    nationality: String
    province: String
    district: String
    sector: String
    discipline: String
    isEmployed: Boolean
    haveLaptop: Boolean
    isStudent: Boolean
    Hackerrank_score: String
    english_score: String
    interview: Int
    interview_decision: String
    applicationPost: String
    otherApplication: String
    andelaPrograms: String
    otherPrograms: String
    understandTraining: Boolean
    trainee_id: ID!
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