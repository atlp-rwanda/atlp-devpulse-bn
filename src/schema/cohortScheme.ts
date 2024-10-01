import { gql } from "apollo-server-core";

export const cohortSchema = gql`
	type cohort {
		id: ID!
        title: String
		program: String
		cycle: String
		start: String
		end: String
		phase: CohortPhase
		trainees:[ID!]
		
	}

	enum CohortPhase {
    core
    team
    apprenticeship
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
		phase: CohortPhase
  }
	type Mutation {
		createCohort(cohortFields: cohortInput): cohort
		deleteCohort(id: ID!): cohort
		updateCohort(
			title: String
			program: String
		    cycle: String
			phase: CohortPhase
            start: String
            end: String
		): cohort!
	}
`;
