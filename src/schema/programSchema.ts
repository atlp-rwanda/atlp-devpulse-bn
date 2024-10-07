import { gql } from 'apollo-server-express';

export const programTypeDefs = gql`
  type Query {
    getAll(data: Page!): [Program!]!
    selectedPrograms(
      filter: ProgramFilter!
      page: Int
      pageSize: Int
    ): [Program!]!
    geSingleProgram(id: ID!): Program!
    filterProgramsDetails(input: FilterOptions): [Program]
		getAllProgramAttributescount: Count!
  }
  type Count {
    total: Int!
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
    _id: String!
    title: String!
    description: String!
    mainObjective: String!
    requirements: [String!]!
    modeOfExecution: String!
    duration: String!
  }
  input ProgramInput {
    title: String!
    description: String!
    mainObjective: String!
    requirements: [String!]!
    modeOfExecution: String!
    duration: String!
  }
  input updateProgramInput {
    _id: String!
    title: String!
    description: String!
    mainObjective: String!
    requirements: [String!]!
    modeOfExecution: String!
    duration: String!
  }
  input FilterOptions { 
    page: Int!
    itemsPerPage: Int
    All: Boolean
    wordEntered: String
    filterAttribute: String
  }
  type Mutation {
    createProgram(programInput: ProgramInput!): Program!
    updateProgram(updateProgramInput: updateProgramInput): Program!
    deleteProgram(_id: String!): Program
  }
`;
