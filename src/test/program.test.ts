import { gql } from 'apollo-server-express';
import { programTypeDefs } from '../schema/programSchema';

test('check types', () => {
  expect(programTypeDefs).toBe(gql`
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
    input updateProgramInput {
      _id: ID!
      title: String!
      description: String!
      mainObjective: String!
      requirements: [String!]!
      modeOfExecution: String!
    }
    type Mutation {
      createProgram(programInput: ProgramInput!): Program!
      updateProgram(
        _id: ID!
        title: String!
        description: String!
        mainObjective: String!
        requirements: [String!]!
        modeOfExecution: String!
      ): Program!
      deleteProgram(_id: ID!): Program
    }
  `);
});
