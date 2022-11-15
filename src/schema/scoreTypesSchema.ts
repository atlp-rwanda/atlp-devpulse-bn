import { gql } from "apollo-server";

const Schema = gql`
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

export default Schema;
