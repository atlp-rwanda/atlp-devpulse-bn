import { gql } from "apollo-server-core";

export const formJobSchema = gql`
	type JobPostApplication {
		id: ID!
		program: Program
		cycle: applicationCycle
		cohort: cohort
		link: String!
        title: String!
		description: String!
		label: String
	}
	input PostFilter {
        program: String
        cycle: String
        cohort: String
    }
	type Query {
		getJobApplication(id: ID!): JobPostApplication
		getAllJobApplication(input: pagination, filter:PostFilter): [JobPostApplication!]!
	}
	input jobInput {
		title: String
		program: String!
		cohort: String!
		cycle: String!
		description: String!
		label: String!
    }
	input jobUpdate {
		title: String
		program: String
		cohort: String
		cycle: String
        link: String
		description: String
		label: String
    }
	type Mutation {
		createJobApplication(jobFields: jobInput): JobPostApplication
		deleteJobApplication(id: ID!): String!
		updateJobApplication(
		    id: String,
			jobFields: jobUpdate
		): JobPostApplication!
	}
`;
