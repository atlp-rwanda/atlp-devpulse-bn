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
    gender: String
    birth_date: String
    Address: String
    phone: String
    field_of_study: String
    education_level: String
    currentEducationLevel: String
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
    applicationPost: String
    otherApplication: String
    andelaPrograms: String
    otherPrograms: String
    understandTraining: Boolean
    discipline: String
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
    currentEducationLevel: String
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
    applicationPost: String
    otherApplication: String
    andelaPrograms: String
    otherPrograms: String
    understandTraining: Boolean
    discipline: String
  }

  type traineeAttribute {
    _id: ID
    gender: String
    birth_date: String
    Address: String
    phone: String
    field_of_study: String
    education_level: String
    currentEducationLevel: String
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
    applicationPost: String
    otherApplication: String
    andelaPrograms: String
    otherPrograms: String
    understandTraining: Boolean
    discipline: String
    trainee_id: traineeApplicant!
  }

  type traineeAttributeCreated {
    gender: String
    birth_date: String
    Address: String
    phone: String
    field_of_study: String
    education_level: String
    currentEducationLevel: String
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
    applicationPost: String
    otherApplication: String
    andelaPrograms: String
    otherPrograms: String
    understandTraining: Boolean
    discipline: String
    _id: ID
    trainee_id: String!
  }
`;