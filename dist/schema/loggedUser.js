"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggedUserSchema = void 0;
const apollo_server_1 = require("apollo-server");
exports.LoggedUserSchema = (0, apollo_server_1.gql) `
  type User_Logged {
    id: String
    createdAt: String
    name: String
    email: String
  }

  input UserInput_Logged {
    name: String
    email: String
  }
  input EditUserInput_Logged {
    name: String
  }

  type Query {
    user_Logged(ID: ID!): User_Logged!
    getUsers_Logged(amount: Int): [User_Logged]
  }

  type Mutation {
    createUser_Logged(userInput: UserInput_Logged): User_Logged!
    deleteUser_Logged(ID: ID!): Boolean
    updateUser_Logged(ID: ID!, editUserInput: EditUserInput_Logged): Boolean
  }
`;
