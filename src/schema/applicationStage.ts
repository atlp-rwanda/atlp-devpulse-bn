import { gql } from "apollo-server-core";

export const applicationStageDefs = gql`
  type Stage {
    enteredAt: String! 
    exitedAt: String
    stage: String!
    comments: String
    score: Float
  }

  type Applicant {
    id: ID! 
    stages: [Stage!]!
    applicationPhase: String!
  }

  type Query {
    getStageHistory(applicantId: ID!): [Stage!]! 
  }

  type Mutation {
    moveToNextStage(applicantId: ID!, nextStage: String!,comments: String, score: Float): Applicant!
  }
`;
