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
    isActive: Boolean,
    applicationPhase: String,
    cohort: Cohort

  }

  type Role {
    _id: ID!
    roleName: String!
    description: String!
    permissions: [Permission]
  }

  type Cohort {
    id: ID!
    title: String
		program: String
		cycle: String
		start: String
		end: String
		phase: CohortPhase
		trainees:[User_Logged!]
  }

  enum CohortPhase {
    core
    team
    apprenticeship
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
    applicationPhase: String
  }
  input EditUserInput_Logged {
    firstname: String
    lastname: String
    applicationPhase: String
    cohortId: ID
  }
  input EmailInput {
    email: String
  }

  type Query {
    user_Logged(ID: ID!): User_Logged!
    getUsers_Logged(amount: Int): [User_Logged]
    checkUserRole(email: String): Role!
    getCohort(id: ID!): cohort
		getAllCohorts: [cohort!]!
  }

  type Mutation {
    createUser_Logged(userInput: UserInput_Logged): User_Logged!
    resendVerifcationEmail(userInput: EmailInput!): String
    deleteUser_Logged(ID: ID!): Boolean
    updateUser_Logged(ID: ID!, editUserInput: EditUserInput_Logged): Boolean
    assignRoleToUser(ID: ID!, roleID: ID!): User_Logged
    updateUserStatus(ID: ID!): Boolean
    updateApplicationPhase(userID: ID!, newPhase: String!, cohortID: ID): User_Logged
  }
`;