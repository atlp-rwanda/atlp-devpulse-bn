"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_1 = require("apollo-server");
const Schema = (0, apollo_server_1.gql) `
  type scoreValue {
    id: ID!
    score_value: String!
    attr_id: traineeAttribute!
    score_id: scoreType!
  }

  input scoreArr {
    score_id: String!
    score_value: String!
  }

  input createScoreValue {
    attr_id: String!
    score_id: String!
    score_value: String!
  }
  input updateScoreValue {
    id: ID!
    score_value: String!
  }
  input updateManyScoreValue {
    id: ID!
    score_value: String!
  }
  input deleteScoreValue {
    id: ID!
  }

  type Query {
    getAllScoreValues: [scoreValue]
    getOneScoreValue(id: ID!): scoreValue!
  }

  type Mutation {
    createScoreValue(input: [createScoreValue]): [scoreValue!]
    deleteScoreValue(id: ID!): scoreValue!
    updateScoreValue(id: ID!, input: updateScoreValue): scoreValue!
    updateManyScoreValues(input: [updateManyScoreValue]): [scoreValue!]
  }
`;
exports.default = Schema;
