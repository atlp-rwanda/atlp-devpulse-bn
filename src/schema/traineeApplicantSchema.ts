import { gql } from 'apollo-server'
export const typeDefsTrainee = gql`
  type Query {
    allTrainees(input: pagination): [traineeApplicant]!
    oneTraineeApplicant(id: ID!): Trainee!
  }
  type Mutation {
    createNewTraineeApplicant(input: newTraineeApplicantInput): traineeApplicant
    updateTraineeApplicant(input: traineeApplicantInputUpdate, id:ID!): traineeApplicant
    deleteTraineeApplicant(email: String!): Boolean
  }
  type traineeApplicant {
    lastName: String!
    firstName: String!
    _id: ID!
    email: String!
    delete_at: Boolean!
  }

  input newTraineeApplicantInput {
    lastName: String!
    firstName: String!
    email: String!
    delete_at: Boolean
  }

  input traineeApplicantEmail {
    email: String!
  }

  input traineeApplicantInputUpdate {
    firstName: String!
    lastName: String!
    email: String!
    delete_at: Boolean
  }

  input pagination {
    page: Int!
    itemsPerPage: Int
    All: Boolean
  }
`;