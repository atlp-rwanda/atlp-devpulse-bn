import { gql } from "apollo-server-core";

export const applicationStageDefs = gql`
  type Applicant {
    _id: ID!
    email: String
    firstName: String
    lastName: String
    delete_at: Boolean
    cycle_id: ID
    applicationPhase: String
    status: String
  }

  type Stage {
    stage: String!
    enteredAt: String!
    exitedAt: String
  }
  type HistoryStage {
    applicantId: ID!
    currentStage: String!
    history: [Stage!]!
  }
  type applicant_records {
    applicant: Applicant!
    currentStage: String!
    history: [Stage!]!
  }

  type Query {
    getStageHistoryByApplicant(applicantId: ID!): HistoryStage
    getApplicantsByStage(stage: String!): [applicant_records!]!
  }

  type response {
    success: Boolean!
    message: String
  }

  type Mutation {
    moveToNextStage(
      applicantId: ID!
      nextStage: String!
      comments: String
    ): response!

    addScore(applicantId:ID!
    applicantStage:String!
    score: Float!): response!
  }
`;
