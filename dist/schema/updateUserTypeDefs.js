"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserTypeDefs = void 0;
const apollo_server_1 = require("apollo-server");
exports.updateUserTypeDefs = (0, apollo_server_1.gql) `
  type User {
    id: String
    createdAt: String
    firstName: String
    lastName: String
    email: String
  }

  input UserInput {
    firstName: String
    lastName: String
    email: String
  }
  input EditUserInput{
      firstName: String,
      lastName: String
  }

  type Query {
    user(ID: ID!): User!
    getUsers(amount: Int): [User]
  }

   type Mutation {
    createUser(userInput: UserInput): User!
    deleteUser(ID: ID!): Boolean
    updateUser(ID:ID!, editUserInput:EditUserInput): Boolean
  }
`;
