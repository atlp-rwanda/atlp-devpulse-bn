import { gql } from "apollo-server";
export const typeDefsAdditionalFields = gql`
  type Query {
    getAllAdditionalAttributesFields: [additionalField]!
    getAdditionalAttributesField(ID:ID!): additionalField!
  }
  type Mutation {
    createAdditionalAttributesField(input: newAdditionalFieldInput): additionalField!
    updateAdditionalField(ID:ID!, updateInput: AdditionalFieldInputUpdate): additionalField
    deleteAdditionalField(ID: ID!): additionalField!
  }
  type additionalField {
    fieldName: String!
    keyvalue: String!
    _id: ID!
  }

  input newAdditionalFieldInput {
    fieldName: String!
    keyvalue: String!
    id:String!
  }
  input deleteAdditionalField{
    id:ID!
 }

  input AdditionalFieldInputUpdate {
    fieldName: String
    keyvalue: String
    id:String
  }
`;
