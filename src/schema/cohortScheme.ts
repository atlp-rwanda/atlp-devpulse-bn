import { gql } from "apollo-server-core";

export const cohortSchema = gql`
	type cohort {
		id: ID!
        title: String
		program: Program
		cycle: applicationCycle
		start: String
		end: String
		phase: String
		trainees:[traineeApplicant]
		manager: String

		
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
		phase: String!
		manager: String
  }
  input updateCohortInput {
    title: String
    program: String
    cycle: String
    start: String
    end: String
    phase: String
	manager: String
  }

	type Mutation {
		createCohort(cohortFields: cohortInput): cohort
		deleteCohort(id: ID!): String
		updateCohort(id: ID!, cohortFields: updateCohortInput): cohort
	}
`;
