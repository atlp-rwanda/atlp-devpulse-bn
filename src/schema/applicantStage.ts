import { gql } from "apollo-server-core";

export const applicantStageDefs = gql`
  type TraineeApplicant {
    id: ID!
    user: User!
    email: String!
    firstName: String!
    lastName: String!
    cycle_id: ApplicationCycle
    cohort: Cohort
    applicationPhase: String!
    status: String!
  }

  type ApplicationCycle {
    id: ID!
    name: String!
    description: String!
    startDate: String!
    endDate: String!
  }

  type Cohort {
    id: ID!
    name: String!
    description: String!
  }

  type Stage {
    enteredAt: String! 
    exitedAt: String
    stage: String!
    comments: String
    score: Float
  }

  type Query {
    getTraineeCyclesApplications: [TraineeApplicant!]!
    getCycleApplicationStages(traineeApplicant: ID!): StageResponse!
  }

  type StageResponse {
    stages: [Stage!]!
    message: String!
  }

  type Mutation {
    applyCycle(cycle_id: ID!): ApplyResponse!
  }

  type ApplyResponse {
    message: String!
  }
`;
