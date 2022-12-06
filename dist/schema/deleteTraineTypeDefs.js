"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_1 = require("apollo-server");
const Schema = (0, apollo_server_1.gql) `
  type Trainee {
    id: ID!
    email: String!
    firstName: String!
    lastName: String!
    delete_at: Boolean
    cycle_id: applicationCycle
  }

  input softdeleteTrainee {
    id: ID!
  }
  input softRecover {
    id: ID!
    delete_at: Boolean
  }
  input deleteTrainee {
    id: ID!
  }

  type Query {
    getAllTrainees: [Trainee]
    traineeSchema(id: ID!): Trainee!
    getAllSoftDeletedTraineesFiltered(input: filterOptions): [Trainee]
  }
  input filterOptions {
    page: Int!
    itemsPerPage: Int
    All: Boolean
    wordEntered: String
    filterAttribute: String
  }
  type Mutation {
    deleteTrainee(id: ID!): Trainee!
    softdeleteTrainee(input: softdeleteTrainee): Trainee!
    softRecover(input: softRecover): Trainee!
  }
`;
exports.default = Schema;
