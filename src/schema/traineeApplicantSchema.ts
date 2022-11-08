import { gql } from "apollo-server";
export const typeDefsTrainee = gql`
  type Query {
    allTrainees(input: pagination): [traineeApplicant]
    getOneTrainee(ID: ID!): traineeApplicant
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
    delete_at:Boolean
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
    cycle_id: String
  }

  input pagination {
    page: Int!
    itemsPerPage: Int
    All: Boolean
  }
`;
