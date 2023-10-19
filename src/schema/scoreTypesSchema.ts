import { gql } from "apollo-server";

const Schema = gql`
  type scoreType {
    id: ID!
    title:String!
    description:String!
    modeOfEngagement:String!
    duration: Int!
    startDate:String
    endDate:String
    program:Program
    grading:Grading
  }

  input createScoreType {
    title:String!
    description:String!
    modeOfEngagement:String!
    duration: Int!
    startDate:String
    durationUnit:String!
    endDate:String
    program:String
    grading:String
  }
  input updateScoreType {
    title:String
    description:String
    modeOfEngagement:String
    duration: Int
    startDate:String
    endDate:String
    program:String
  }
  input deleteScoreType {
    id: ID!
  }

  type Query {
    getAllScoreTypes(title: String, programId: String,description:String,modeOfEngagement:String): [scoreType]
    getOneScoreType(id: ID!): scoreType
  }

  type Mutation {
    createScoreType(input: createScoreType): scoreType!
    deleteScoreType(id: ID!): scoreType!
    updateScoreType(id: ID!, input: updateScoreType): scoreType!
  }
`;

export default Schema;
