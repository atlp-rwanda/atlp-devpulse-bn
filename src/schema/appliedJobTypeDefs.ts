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
  appliedJob:[FieldData!]!
  status:String
}

type Query {
  getAllAppliedJobs:[AppliedJobData!]
  getAppliedJob(id: ID!): AppliedJobData!
  getMyOwnAppliedJob:[AppliedJobData!]
  }

  type Mutation {
    saveSheetData(sheetLink: String!): Boolean
  }
`;
