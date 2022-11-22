import { gql } from "apollo-server";

const Schema = gql`
  type Query {
    sendBulkyEmail(params: sendParams): response
  }
  type response {
    status: String!
    data: String!
  }
  input sendParams {
    to: String!
    cc: String
    bcc: String
    subject: String!
    html: String!
  }
`;
export default Schema;
