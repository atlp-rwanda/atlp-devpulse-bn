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
    loginTime: String!
    ipAddress: String
  }

  type Query {
    getLoginHistory(userId: ID!): [LoginHistory!]!
  }
`;
 
export default userLoginSchema;
