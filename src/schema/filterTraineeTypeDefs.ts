import { gql } from 'apollo-server'
export const filterTraineetypeDefs = gql`
type Query {
	filterTraineesDetails(input: filterOptions): [traineeAttribute]
}
input one {id: ID!}
    
    input filterOptions {
		page: Int!
		itemsPerPage: Int
		All: Boolean
        wordEntered: String
        filterAttribute: String
	}	

	type traineeAttribute {
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
        isEmployed: Boolean!
        haveLaptop: Boolean!
        isStudent: Boolean!
        Hackerrank_score: String!
        english_score: String!
        interview_decision: String!
        past_andela_programs: String!
        _id:ID
		trainee_id: traineeApplicant!
	}

`