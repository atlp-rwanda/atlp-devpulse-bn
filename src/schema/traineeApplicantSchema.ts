import { gql } from "apollo-server";
export const typeDefsTrainee = gql`
  type Query {
    allTrainees(input: pagination): [traineeApplicant]
  }
  type Mutation {
    createNewTraineeApplicant(input: newTraineeApplicantInput): traineeApplicant
    updateTraineeApplicant(input: traineeApplicantInputUpdate): traineeApplicant
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
  }

  input traineeApplicantEmail {
    email: String!
  }

  input traineeApplicantInputUpdate {
<<<<<<< HEAD
    firstname: String
    lastname: String
=======
    firstName: String
    lastName: String
>>>>>>> 22495f9 (Update and getTraineedetails)
  }

  input pagination {
    page: Int!
    itemsPerPage: Int
    All: Boolean
  }
`;
