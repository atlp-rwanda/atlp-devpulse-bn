import { gql } from "apollo-server";

export const permissionSchemaTypeDef = gql`
   
  type Mutation {
  deletePermission(ID: ID!): Boolean
  }

  type Query {
     getPermission(id: ID!): Permission
     getAllPermissions: [Permission!]!
  }

  type Permission {
    _id: ID!
    entity: String!
    create: Boolean!
    viewOwn: Boolean! 
    viewMultiple: Boolean!
    viewOne: Boolean!
    updateOwn: Boolean!
    updateMultiple: Boolean!
    updateOne: Boolean!
    deleteOwn: Boolean!
    deleteMultiple: Boolean!
    deleteOne: Boolean!
  }
`;
