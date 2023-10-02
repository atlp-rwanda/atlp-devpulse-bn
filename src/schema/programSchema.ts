// schema.ts
import { gql } from 'apollo-server-express';

export const programTypeDefs = gql`
type Query {
  getAll (data:Page!): [Program!]!
  selectedPrograms(filter: ProgramFilter!,page:Int,pageSize:Int): [Program!]!
  geSingleProgram(id:ID!):Program!
}
input ProgramFilter {
  title: String
  modeOfExecution: String
  mainObjective: String
}

input Page {
  page: Int!
  pageSize: Int!
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


