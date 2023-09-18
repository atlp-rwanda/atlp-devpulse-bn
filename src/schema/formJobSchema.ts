import { gql } from "apollo-server-core";

export const formJobSchema = gql`
	type JobPostApplication {
		id: ID!
		link: String!
		category: String!
        title: String!
		description: String!
	}
	type Query {
		getJobApplication(id: ID!): Application
		getAllJobApplication: [Application!]!
	}
	type Mutation {
		createJobApplication(
			title: String!
			category: String!
            link: String!
			description: String!
		): Application
		deleteJobApplication(id: ID!): Application
		updateJobApplication(
			id:String!
			title: String!
			category: String!
            link: String!
			description: String!
		): Application!
	}
`;
