import { gql } from "apollo-server-core";

export const cohortSchema = gql`
	type cohort {
		id: ID!
        title: String
		program: Program
		cycle: applicationCycle
		start: String
		end: String
		phase: Int
		trainees:[ID!]
		
	}


	type Query {
		getCohort(id: ID!): cohort
		getAllCohorts: [cohort!]!
	}
	input cohortInput {
		title: String
		program: String!
		cycle: String!
        start: String!
        end: String!
		phase: Int
  }
	type Mutation {
		createCohort(cohortFields: cohortInput): cohort
		deleteCohort(id: ID!): cohort
		updateCohort(
			title: String
			program: String
		    cycle: String
			phase: Int
            start: String
            end: String
		): cohort!
	}
`;
