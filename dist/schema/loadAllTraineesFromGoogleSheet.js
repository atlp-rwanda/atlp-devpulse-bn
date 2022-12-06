"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_1 = require("apollo-server");
const Schema = (0, apollo_server_1.gql) `

type Query{
    getAllTraineeApplicant:[traineeApplicant]!
    getAllTraineeAtributes:[traineeAttribute]!
}

type traineeApplicant{
    id:ID!
    firstName:String!
    lastName:String!
    email:String!
}
type traineeAttribute{
    gender:String!
    birth_date:String!
    Address:String!
    phone:String!
    field_of_study:String!
    education_level:String!
    province:String!
    district:String!
    sector:String!
    cycle_id:String!
    isEmployed:Boolean!
    haveLaptop:Boolean!
    isStudent:Boolean!
    Hackerrank_score:String!
    english_score:String!
    interview:Int!
    interview_decision:String!
    past_andela_programs:String! 
}

type Mutation{
    loadAllTrainees(spreadsheetId:String!):String!
}
`;
exports.default = Schema;
