// schema.ts
import { gql } from 'apollo-server-express';

export const programTypeDefs = gql`
type Query {
  programs: [Program!]!
}

type Program {
    _id: ID!
    title: String!
    description: String!
    mainObjective: String!
    requirements: [String!]!
    modeOfExecution: String!
  }
  
  input ProgramInput {
    title: String!
    description: String!
    mainObjective: String!
    requirements: [String!]!
    modeOfExecution: String!
  }
  
  type Mutation {
    createProgram(programInput: ProgramInput!): Program!
  }   
`;


