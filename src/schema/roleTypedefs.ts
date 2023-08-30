import { gql } from 'apollo-server';

export const roleSchema = gql`
  type Role {
    _id: ID!
    roleName: String!
    description: String!
    permissions: [Permission]
  }
  
  input CreateRoleInput {
    roleName: String!
    description: String!
  }

  input UpdateRoleInput {
    _id: ID!
    roleName: String
    description: String
  }
  
  type Mutation {
    createRole(input: CreateRoleInput!): Role
    updateRole(input: UpdateRoleInput!): Role
    deleteRole(id: ID!): Boolean
    assignPermissionsToRole(roleId: ID!, permissionIds: [ID!]!): Role
  }
  
  type Query {
    role(id: ID!): Role
    roles: [Role!]!
  }
`;
