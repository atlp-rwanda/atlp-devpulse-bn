import { gql } from "apollo-server-core";

export const formSchema = gql`
	type Application {
		id: ID!
		link: String!
		title: String!
		jobpost: String!
		description: String!
	}

	type Query {
		getApplication(id: ID!): Application
		getAllApplications: [Application!]!
	}

	type Mutation {
		createApplication(
			link: String!
			title: String!
			jobpost: String!
			description: String!
		): Application
		deleteApplication(id: ID!): Application
		updateApplication(
			id:String!
			link: String!
			title: String!
			jobpost: String!
			description: String!
		): Application!
	}
`;
