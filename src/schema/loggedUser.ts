import { gql } from "apollo-server";

export const LoggedUserSchema = gql`
  type User_Logged {
    id: String
    createdAt: String
    name: String
    email: String
    picture:String
    role: Role
    isActive: Boolean
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
    assignRoleToUser(ID: ID!, roleID: ID!): User_Logged
    updateUserStatus(ID: ID!): Boolean
  }
`;
