import { gql } from 'apollo-server'
export const typeDefsCollection = gql`
type Query {
	allTraineesCollection(input: pagination): [traineeCollection]
}
type Mutation {
	createTraineeCollection(input: traineeCollectionInput): traineeCollectionCreated
}
	input pagination {
		page: Int!
		itemsPerPage: Int
		All: Boolean
	}

	input traineeCollectionInput {
		gender: String!
		birth_date: String!
        Address: String!
        phone: String!
        field_of_study: String!
        education_level: String!
        province: String!
        district: String!
        sector: String!
        cohort: String!
        isEmployeed: Boolean!
        haveLaptop: Boolean!
        isStudent: Boolean!
        Hackerrank_score: String!
        english_score: String!
        interview_decision: String!
        past_andela_programs: String!
        trainee: String!
	}

	type traineeCollection {
        gender: String!
		birth_date: String!
        Address: String!
        phone: String!
        field_of_study: String!
        education_level: String!
        province: String!
        district: String!
        sector: String!
        cohort: String!
        isEmployeed: Boolean!
        haveLaptop: Boolean!
        isStudent: Boolean!
        Hackerrank_score: String!
        english_score: String!
        interview_decision: String!
        past_andela_programs: String!
        _id:ID
		trainee: traineeApplicant!
	}

    	type traineeCollectionCreated {
        gender: String!
		birth_date: String!
        Address: String!
        phone: String!
        field_of_study: String!
        education_level: String!
        province: String!
        district: String!
        sector: String!
        cohort: String!
        isEmployeed: Boolean!
        haveLaptop: Boolean!
        isStudent: Boolean!
        Hackerrank_score: String!
        english_score: String!
        interview_decision: String!
        past_andela_programs: String!
        _id:ID
		trainee: String!
	}
`