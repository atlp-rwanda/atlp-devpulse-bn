import { gql } from "apollo-server";
const Schema = gql`

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
`
export default Schema