import { gql } from "apollo-server";
export const typeDefsAttribute = gql`
  type Query {
    allTraineesDetails(input: pagination): [traineeAttribute]
    getOneTraineeAllDetails(input: one): traineeAttribute
}
type Mutation {
	createTraineeAttribute(attributeInput: traineeAttributeInput): traineeAttributeCreated
	updateTraineeAttribute(ID:ID!, attributeUpdateInput: traineeUpdateAttributeInput): traineeAttributeCreated
    deleteTraineeAttribute(ID:ID!): traineeAttributeCreated
}
input one {id: ID!}
    
    input pagination {
		page: Int!
		itemsPerPage: Int
		All: Boolean
	}

  input traineeAttributeInput {
    gender: String!
    birth_date: String!
    Address: String!
    phone: String!
    field_of_study: String!
    education_level: String!
    province: String!
    district: String!
    sector: String!
    isEmployed: Boolean!
    haveLaptop: Boolean!
    isStudent: Boolean!
    Hackerrank_score: String!
    english_score: String!
    interview_decision: String!
    past_andela_programs: String!
    trainee_id: String!
  }
  input traineeUpdateAttributeInput {
    gender: String
    birth_date: String
    Address: String
    phone: String
    field_of_study: String
    education_level: String
    province: String
    district: String
    sector: String
    isEmployed: Boolean
    haveLaptop: Boolean
    isStudent: Boolean
    Hackerrank_score: String
    english_score: String
    interview_decision: String
    past_andela_programs: String
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
    isEmployed: Boolean!
    haveLaptop: Boolean!
    isStudent: Boolean!
    Hackerrank_score: String!
    english_score: String!
    interview_decision: String!
    past_andela_programs: String!
    _id: ID
    trainee_id: traineeApplicant!
  }

  type traineeAttributeCreated {
    gender: String!
    birth_date: String!
    Address: String!
    phone: String!
    field_of_study: String!
    education_level: String!
    province: String!
    district: String!
    sector: String!
    isEmployed: Boolean!
    haveLaptop: Boolean!
    isStudent: Boolean!
    Hackerrank_score: String!
    english_score: String!
    interview_decision: String!
    past_andela_programs: String!
    _id: ID
    trainee_id: String!
  }
`;
