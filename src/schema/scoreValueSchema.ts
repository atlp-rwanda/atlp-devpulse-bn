import { gql } from "apollo-server";

const Schema = gql`
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

export default Schema;
