"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_1 = require("apollo-server");
const Schema = (0, apollo_server_1.gql) `
  type scoreType {
    id: ID!
    score_type: String!
  }

  input createScoreType {
    score_type: String!
  }
  input updateScoreType {
    id: ID!
    score_type: String!
  }
  input deleteScoreType {
    id: ID!
  }

  type Query {
    getAllScoreTypes: [scoreType]
    getOneScoreType(id: ID!): scoreType
  }

  type Mutation {
    createScoreType(input: createScoreType): scoreType!
    deleteScoreType(id: ID!): scoreType!
    updateScoreType(id: ID!, input: updateScoreType): scoreType!
  }
`;
exports.default = Schema;
