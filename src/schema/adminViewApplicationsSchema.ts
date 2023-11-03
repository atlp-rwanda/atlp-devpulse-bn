import { gql } from 'apollo-server-express';

export const adminViewAllApplicationsTypedefs = gql`

 
  type ApplicationData {
    _id: ID!
    firstName: String!
    lastName: String!
    email: String!
    telephone: String!
    availability_for_interview: String!
    gender: String!
    resume: String!
    comments: String!
    address: String!
    status: String!
    formUrl: String!
    dateOfSubmission: String!
    associatedFormData: FormData
  }

  type FormData {
    _id: ID!
    title: String!
    description: String!
    link: String!
    jobpost: Jobpost
  }

  type Jobpost {
    _id: ID!
    title: String
	cycle: applicationCycleField
    program: ProgramFeild 
	cohort: CohortFeild
	link: String!
	description: String!
	label: String
  }
  type CohortFeild {
    id: ID!
    title: String
	start: String
	end: String
  }
  type ProgramFeild {
    _id: String!
    title: String
    description: String
    mainObjective: String
    requirements: [String!]
    modeOfExecution: String
    duration: String
  }
  type applicationCycleField {
    id:ID!
    name:String!
    startDate:String!
    endDate:String!
  }
  type Query {
    adminViewApplications(
      page: Int
      pageSize: Int
      searchParams: ApplicationSearchInput
    ): ApplicationList
    adminViewSingleApplication(applicationId: ID!): ApplicationData
  }

  input ApplicationSearchInput {
    jobAppliedFor: ID
    programAppliedFor: ID
    cycle: ID
    cohort: ID
    gender: String
    applicationStatus: String
  }

  type ApplicationList {
    applications: [ApplicationData]
    totalApplications: Int
  }

  type Mutation {
    adminUpdateApplicationStatus(applicationId: ID!, newStatus: String!): ApplicationData
  }
`;