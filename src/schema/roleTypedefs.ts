import { gql } from 'apollo-server';

export const roleSchema = gql`
  input PermissionInput {
    entity: String!
    permissions: [String!]!
  }

  type Permission {
    entity: String!
    permissions: [String!]!
  }

  type Role {
    _id: ID!
    roleName: String!
    description: String!
    permissions: [Permission]
  }

  input CreateRoleInput {
    roleName: String!
    description: String!
    permissions: [PermissionInput]
  }

  input UpdateRoleInput {
    roleName: String
    description: String
    permissions: [PermissionInput]
  }

  type Mutation {
    createRole(input: CreateRoleInput!): Role
    updateRole(id: ID!, input: UpdateRoleInput!): Role
    deleteRole(id: ID!): Boolean
  }

  type Query {
    getRole(id: ID!): Role
    getAllRoles: [Role!]!
  }
`;
