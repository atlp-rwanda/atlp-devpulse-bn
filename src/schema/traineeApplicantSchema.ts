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
    lastname: String!
    firstname: String!
    _id: ID!
    email: String!
  }

  input newTraineeApplicantInput {
    lastname: String!
    firstname: String!
    email: String!
    cycle: String
  }

  input traineeApplicantEmail {
    email: String!
  }

  input traineeApplicantInputUpdate {
    firstname: String
    lastname: String
    cycle: String
  }

  input pagination {
    page: Int!
    itemsPerPage: Int
    All: Boolean
  }
`;
