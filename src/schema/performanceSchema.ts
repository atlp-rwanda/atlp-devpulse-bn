import { gql } from "apollo-server";
export const performanceSchema = gql`
  type Performance {
    id: ID!
    trainee: ID!
    score: Float!
    date: String!
  }

  type PerformanceResponse {
    performances: [Performance!]!
    averageScore: Float!
  }

  type Query {
    getTraineePerformance(traineeId: ID!): PerformanceResponse!
  }

  input AddPerformanceInput {
    trainee: ID!
    score: Float!
    date: String!
  }

  type Mutation {
    addTraineePerformance(input: AddPerformanceInput): Performance!
  }


`