import { gql } from "apollo-server"

export const updateUserTypeDefs = gql`
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
    updateUserSelf(ID:ID!, editUserInput: EditUserInput): Boolean
  }
`;

