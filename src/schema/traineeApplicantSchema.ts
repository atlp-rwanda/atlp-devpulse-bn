import { gql } from "apollo-server";
export const typeDefsTrainee = gql`
  type Query {
    allTrainees(input: pagination): response
    getOneTrainee(ID: ID!): traineeApplicant
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
  }
  type traineeApplicant {
    lastName: String!
    firstName: String!
    _id: ID!
    email: String!
    cycle_id: applicationCycle
    delete_at: Boolean
    status: String!
  }

  input newTraineeApplicantInput {
  lastName: String!
  firstName: String!
  email: String!
  cycle_id: String!
  attributes: traineeAttributeInput
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
