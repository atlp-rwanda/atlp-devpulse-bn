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
    cycleApplied: [CycleApplied!]!
    delete_at: Boolean
    status: String!
    applicationPhase: ApplicationPhase!
    cohort: ID
    role: Role
    createdAt: String!
    user: User
    coverLetterUrl: String!
    idDocumentUrl: String!
    resumeUrl: String!
  }

  type CycleApplied {
    _id: ID!
    cycle: ApplicationCycle!
  }

  type User {
    _id: ID!
  }

  type applicationCycle {
    _id: ID!
    name: String!
    startDate: String!
    endDate: String!
  }

  type AcceptTraineeResponse {
    success: Boolean!
    message: String!
  }

  enum ApplicationPhase {
    Applied
    Shortlisted
    Technical_Assessment
    Interview_Assessment
    Admitted
    Rejected
    Enrolled
  }

  input newTraineeApplicantInput {
    lastName: String!
    firstName: String!
    email: String!
    cycle_id: ID!
    role: ID
    attributes: traineeAttributeInput
    coverLetterUrl:String
    idDocumentUrl:String
    resumeUrl:String
  }

  input traineeApplicantEmail {
    email: String!
  }

  input traineeApplicantInputUpdate {
    firstName: String
    lastName: String
    cycle_id: ID
    role: ID
    status: String
  }

  input pagination {
    page: Int!
    itemsPerPage: Int
    All: Boolean
  }
`;
