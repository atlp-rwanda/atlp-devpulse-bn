import { gql } from "apollo-server";

const Schema = gql`
  type Query {
    sendBulkyEmail(params: sendParams): send_response
  }
  type send_response {
    status: String!
    mail_res: String!
  }
  input sendParams {
    to: [String!]
    cc: String
    bcc: String
    subject: String!
    html: String!
  }
`;
export default Schema;
