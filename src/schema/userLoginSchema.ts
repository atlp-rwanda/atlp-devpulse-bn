import { gql } from "apollo-server";

const userLoginSchema = gql`
  type AuthPayload {
    token: String!
    userId: ID!
  }

  type Mutation {
    login(email: String!, password: String!): AuthPayload
  }

  type LoginHistory {
    userId: ID!
    email: String!
    loginTime: String!
    ipAddress: String
    browser: String!
  }

  type Query {
    getLoginHistory(userId: ID!): [LoginHistory!]!
  }
`;
 
export default userLoginSchema;
