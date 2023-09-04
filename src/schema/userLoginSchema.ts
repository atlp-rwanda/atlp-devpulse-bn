import { gql } from "apollo-server";

const userLoginSchema = gql`
  type AuthPayload {
    token: String!
  }

  type Mutation {
    login(email: String!, password: String!): AuthPayload
  }
`;

export default userLoginSchema;
