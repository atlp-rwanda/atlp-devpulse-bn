import { gql } from "apollo-server";
export const typeDefsTrainee = gql`
  type Query {
    allTrainees(input: pagination): response
    getOneTrainee(ID: ID!): traineeApplicant
    getTraineeByUserId(userId: ID!): ID!
  }
  type response {
    totalItems: Int!
    page: Int!
    itemsPerPage: Int!
    data: [traineeApplicant]!
  }
  type Mutation {
    createNewTraineeApplicant(
      input: newTraineeApplicantInput
    ): traineeApplicant!
    updateTraineeApplicant(
      ID: ID!
      updateInput: traineeApplicantInputUpdate
    ): traineeApplicant
    deleteTraineeApplicant(email: String!): Boolean
    acceptTrainee(traineeId: ID!, cohortId: ID!): AcceptTraineeResponse!
  }
  type traineeApplicant {
    lastName: String!
    firstName: String!
    _id: ID!
    email: String!
    cycle_id: applicationCycle
    delete_at: Boolean
    status: String!
    applicationPhase: ApplicationPhase!
    cohort: ID
  }

  type AcceptTraineeResponse {
    success: Boolean!
    message: String!
  }

  enum ApplicationPhase {
    Applied
    Interviewed
    Accepted
    Enrolled
  }

  input newTraineeApplicantInput {
    lastName: String!
    firstName: String!
    email: String!
    cycle_id: String!
  }

  input traineeApplicantEmail {
    email: String!
  }

  input traineeApplicantInputUpdate {
    firstName: String
    lastName: String
    cycle_id: String!
    status: String
  }

  input pagination {
    page: Int!
    itemsPerPage: Int
    All: Boolean
  }
`;
