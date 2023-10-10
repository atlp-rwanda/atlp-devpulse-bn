import { gql } from "apollo-server";

const Schema = gql`
  type scoreType {
    id: ID!
    title:String!
    description:String!
    modeOfEngagement:String!
    duration:String!
    startDate:String
    endDate:String
    program:Program
  }

  input createScoreType {
    title:String!
    description:String!
    modeOfEngagement:String!
    duration:String!
    startDate:String
    endDate:String
    program:String
  }
  input updateScoreType {
    title:String
    description:String
    modeOfEngagement:String
    duration:String
    startDate:String
    endDate:String
    program:String
  }
  input deleteScoreType {
    id: ID!
  }

  type Query {
    getAllScoreTypes(title: String, programId: String): [scoreType]
    getOneScoreType(id: ID!): scoreType
  }

  type Mutation {
    createScoreType(input: createScoreType): scoreType!
    deleteScoreType(id: ID!): scoreType!
    updateScoreType(id: ID!, input: updateScoreType): scoreType!
  }
`;

export default Schema;
