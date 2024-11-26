import { gql } from "apollo-server-core";

export const DocSchema = gql`
  type Doc {
    id: ID!
    title: String!
    description: String!
    role:String!
  }

  input createDocVariables {
    title:String
    description:String
    role:String
  }
  type Query {
    getDoc(id: ID!): Doc
    getAllDocs: [Doc!]!
    getDocByRole(role:String!):[Doc!]!
  }
  input docUpdate {
    title: String
    description: String
    role:String
  }
  type Mutation {
    createDoc(docFields: createDocVariables!): Doc
    deleteDoc(id: ID!): Doc
    updateDoc(id: ID!, docFields: docUpdate): Doc
  }
`;
