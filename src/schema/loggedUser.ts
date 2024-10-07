import { gql } from "apollo-server";

export const LoggedUserSchema = gql`
  type User_Logged {
    id: String
    createdAt: String
    firstname: String
    lastname: String
    code: String
    email: String
    role: Role
    picture: String
    country: String
    gender: String
    telephone: String
    password: String
    token: String!
    isActive: Boolean
    isVerified:Boolean
  }

  type Role {
    _id: ID!
    roleName: String!
    description: String!
    permissions: [Permission]
  }

  input UserInput_Logged {
    firstname: String
    lastname: String
    email: String
    password: String
    code: String
    telephone: String
    gender: String
    country: String
    role: String
  }
  input EditUserInput_Logged {
    firstname: String
    lastname: String
  }
  input EmailInput {
    email: String
  }

  type Query {
    user_Logged(ID: ID!): User_Logged!
    getUsers_Logged(amount: Int): [User_Logged]
    checkUserRole(email: String): Role!
  }

  type Mutation {
    createUser_Logged(userInput: UserInput_Logged): User_Logged!
    resendVerifcationEmail(userInput: EmailInput!): String
    verifyUser(ID:ID!):User_Logged
    deleteUser_Logged(ID: ID!): Boolean
    updateUser_Logged(ID: ID!, editUserInput: EditUserInput_Logged): Boolean
    assignRoleToUser(ID: ID!, roleID: ID!): User_Logged
    updateUserStatus(ID: ID!): Boolean
  }
`;