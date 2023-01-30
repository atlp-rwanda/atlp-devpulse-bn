"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_1 = require("apollo-server");
const Schema = (0, apollo_server_1.gql) `

type Trainee{
    id:ID!
    email:String!
    firstName:String!
    lastName:String!
    delete_at:Boolean
}
type traineeApplicant {
    lastName: String!
    firstName: String!
    _id: ID!
    email: String!
}
interface BaseError {
  message: String!
}
type NotFoundError implements BaseError {
  message: String!
}
union results=NotFoundError|traineeApplicant

type Query {
  allSoftDeletedTrainees(input: pagination): [traineeApplicant]
}

type Mutation {
    emptyRecyclebin:results!
}
`;
exports.default = Schema;
