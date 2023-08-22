import { gql } from "apollo-server";

export const permissionSchemaTypeDef = gql`

   type Query {
     permission(id: ID!): Permission
     permissions: [Permission!]!
  }

  type Permission {
    _id: ID!
    entity: String!
    create: PermissionField!
    viewOwn: PermissionField!
    viewMultiple: PermissionField!
    viewOne: PermissionField!
    updateOwn: PermissionField!
    updateMultiple: PermissionField!
    updateOne: PermissionField!
    deleteOwn: PermissionField!
    deleteMultiple: PermissionField!
    deleteOne: PermissionField!
  }

  type PermissionField {
    isPermitted: Boolean!
  }

  input PermissionInput {
    entity: String!
    permissionField: String!
  }

  type Mutation {
    createPermissionEntity(entity: String!): Permission!
    updatePermissionField(input: PermissionInput!): Permission!
    deletePermission(_id: ID!): Boolean
  }
`;
