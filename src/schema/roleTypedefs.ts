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

  input FilterOptions { 
    page: Int!
    itemsPerPage: Int
    All: Boolean
    wordEntered: String
    filterAttribute: String
  }

  type Mutation {
    createRole(input: CreateRoleInput!): Role
    updateRole(id: ID!, input: UpdateRoleInput!): Role
    deleteRole(id: ID!): Boolean
  }

  type Count {
    total: Int!
  }

  type Query {
    getRole(id: ID!): Role
    getAllRoles: [Role!]!
    filterRoleDetails(input: FilterOptions): [Role]
		getAll\RoleAttributescount: Count!
  }
`;
