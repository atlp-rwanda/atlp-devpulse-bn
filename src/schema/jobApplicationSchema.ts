import { gql } from "apollo-server";

export const jobApplicationTypeDefs = gql`
    type Job {
        _id: ID!
        title: String!
    }

    type User {
        _id: ID!
        email: String!
        gender: String!
        firstname: String!
        lastname: String!
        country: String!
        telephone: String!
    }

    type JobApplication {
        _id: ID!
        userId: User
        jobId: Job
        essay: String!
        resume: String!
        status: String!
        comment: String
        createdAt: String!
    }

    input JobApplicationInput {
        jobId: ID!
        essay: String!
        resume: String!
    }

    input SingleJobApplicationInput {
        applicationId: ID!
    }

    input StatusInput {
        applicationId: ID!
        status: String!
        comment: String
    }

    type checkIfUserAppliedOutput {
        status: Boolean!
    }

    input CheckIfUserAppliedInput {
        jobId: ID!
    }

    type Query {
        getOwnJobApplications: [JobApplication!]!
        getAllJobApplications: [JobApplication!]!
        getOneJobApplication(input: SingleJobApplicationInput): JobApplication!
        checkIfUserApplied(input: CheckIfUserAppliedInput): checkIfUserAppliedOutput!
    }

    type Mutation {
        createNewJobApplication(input: JobApplicationInput!): JobApplication!
        changeApplicationStatus(input: StatusInput!): JobApplication!
    }
`
