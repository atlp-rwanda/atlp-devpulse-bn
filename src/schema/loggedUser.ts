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
    authMethod: String
    telephone: String
    password: String
    token: String!
    isActive: Boolean
    applicationPhase: String
    cohort: Cohort
    bio: String,

    isVerified: Boolean
  }

  type Role {
    _id: ID!
    roleName: String!
    description: String!
    permissions: [Permission]
  }

  type PopulatedCoordinator {
    _id: ID!
    firstname: String!
    lastname: String!
    email: String!
    role: Role!
  }

  type TechnicalInterview {
    _id: ID!
    coordinatorId: PopulatedCoordinator!
  }

  type Cohort {
    id: ID!
    title: String
<<<<<<< HEAD
		program: String
		cycle: String
		start: String
		end: String
		phase: Int
		trainees:[User_Logged!]
    manager: String
=======
    program: String
    cycle: String
    start: String
    end: String
    phase: Int
    trainees: [User_Logged!]
>>>>>>> 5a8806a (implement Technical Interview invitation)
  }

  type CurrentUser {
    firstName: String!
    lastName: String!
    email: String!
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
    bio: String
  }
  input EditUserSelfInput_Logged {
    firstname: String
    lastname: String
    email: String
    code: String
    telephone: String
    gender: String
    country: String
    bio: String
  }
  input EditUserInput_Logged {
    firstname: String
    lastname: String
    email: String
    password: String
    telephone: String
    code: String
    picture: String
    applicationPhase: String
    cohortId: ID
    bio: String
  }
  input EmailInput {
    email: String
  }

  input UserFilterInput {
    email: String
    firstName: String
    lastName: String
    country: String
    telephone: String
    gender: String
    authMethod: String
    isActive: Boolean
  }
  type Query {
    user_Logged(ID: ID!): User_Logged!
    getUsers_Logged(amount: Int): [User_Logged]
    getInterviewCoordinators(amount: Int): [User_Logged]
    checkUserRole(email: String): Role!
    getByFilter(filter: UserFilterInput!): [User_Logged]!
    getCohort(id: ID!): cohort
    getAllCohorts: [cohort!]!
    currentUser: CurrentUser
  }

  type Mutation {
    createUser_Logged(userInput: UserInput_Logged): User_Logged!
    resendVerifcationEmail(userInput: EmailInput!): String
    verifyUser(ID: ID!): User_Logged
    deleteUser_Logged(ID: ID!): Boolean
    updateUser_Logged(ID: ID!, editUserInput: EditUserInput_Logged): Boolean
    assignRoleToUser(ID: ID!, roleID: ID!): User_Logged
    updateUserStatus(ID: ID!): Boolean
    updateUserSelf(ID: ID!, editUserInput: EditUserSelfInput_Logged): Boolean
    updateApplicationPhase(
      userID: ID!
      newPhase: String!
      cohortID: ID
    ): User_Logged
  }
`;
