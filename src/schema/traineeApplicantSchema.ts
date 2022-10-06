import { gql } from 'apollo-server'
export const typeDefsTrainee = gql`
type Query {
    allTrainees(input:pagination):[traineeApplicant]
}
type Mutation {
	createNewTraineeApplicant(input: newTraineeApplicantInput ): traineeApplicant
    updateTraineeApplicant(input: traineeApplicantInputUpdate): traineeApplicant
	deleteTraineeApplicant(email: String!) : Boolean
}
	type traineeApplicant {
		lastName: String!
        firstName: String!
		_id: ID!
		email: String!
	}

	input newTraineeApplicantInput {
		lastName: String!
        firstName: String!
		email: String!
	}


	input traineeApplicantEmail {
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