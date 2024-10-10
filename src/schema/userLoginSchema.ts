import { gql } from "apollo-server";

const userLoginSchema = gql`
  type AuthPayload {
    token: String!
    userId: ID!
  }

  type Mutation {
    login(email: String!, password: String!): AuthPayload
  }
`;

export default userLoginSchema;
