import { gql } from "apollo-server";

export const passwordSchema = gql`
  type Mutation {
    forgetPassword(email: String!): Boolean
    resetPassword(token: String!, newPassword: String!): Boolean
    requestPasswordReset(email: String!): RequestPasswordResetResponse!
  }

  type RequestPasswordResetResponse {
    message: String!
  }
`;