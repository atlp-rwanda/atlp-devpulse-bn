import { gql } from 'apollo-server';

export const appliedJobTypeDefs = gql`
type FieldData {
  key: String!
  value: String
}

type SheetData {
  data: [FieldData]
}

type AppliedJobData {
  id:ID!
  data:[FieldData]!
}

type Query {
  getSheetData(sheetLink: String!, range: String!): [SheetData]
  getAllAppliedJobs:[AppliedJobData!]
  getAppliedJob(id: ID!): AppliedJobData!
}

  type Mutation {
    saveSheetData(sheetLink: String!): Boolean
  }
`;
