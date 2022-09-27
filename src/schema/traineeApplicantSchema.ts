import { gql } from 'apollo-server'
export const typeDefsTrainee = gql`
type Query {
    allTrainees(input:pagination):[traineeApplicant]
}
type Mutation {
	createTraineeApplicant(input: traineeApplicantInput ): traineeApplicant
    updateTraineeApplicant(input: traineeApplicantInputUpdate): traineeApplicant
}
	type traineeApplicant {
		firstName: String!
        lastName: String!
		email: String!
		_id: ID
	}

	input traineeApplicantInput {
		firstName: String!
        lastName: String!
		email: String!
	}

    input traineeApplicantInputUpdate {
		firstName: String!
        lastName: String!
		email: String!
        id: ID!
	}

	input pagination {
		page: Int!
		itemsPerPage: Int
		All: Boolean
	}
`