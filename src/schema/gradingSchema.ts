import { gql } from "apollo-server";

export const gradingTypeDefs = gql`
  scalar JSON

  type Grading {
    _id: String!
    title: String!
    assessment: [String!]
    description: String!
    grades: [ScaleAndAttribute]
   
  }

  input ScaleAndAttributeInput {
    scale: ScaleInput
    attribute: String!
  }

  type ScaleAndAttribute {
    scale: Scale!
    attribute:String!
  }

  type Scale {
    name: String!
    lowerValue: ValueDesc!
    upperValue: ValueDesc!
  }

  type ValueDesc {
    value: JSON
    desc: String
  }

  input ScaleInput {
    name: String!
    lowerValue: ValueDescInput
    upperValue: ValueDescInput
  }

  input ValueDescInput {
    value: JSON
    desc: String
  }

  input GradingInput {
    title: String!
    description: String!
    assessment:[String!]
    grades: [ScaleAndAttributeInput]
    
  }

  input ScaleAndAttributeInput {
    scale: ScaleInput
    attribute: String!
  }
  
 input gradingSearch {
  name: String,
  scale: String,
  attribute: String,
 }

 type GradingList {
    gradings: [Grading!]
  }
  type Query {
    viewAllGradings(
      page: Int
      pageSize: Int
      searchParams: gradingSearch
    ): [Grading]
    viewSingleGrading(gradingId: ID!): Grading
  }


  type Mutation {
    createGrading(gradingInput: GradingInput!): Grading!
  }
`;

