import { gql } from "apollo-server";
const Schema = gql`
type Trainee{
    id:ID!
    email:String!
    firstName:String!
    lastName:String!
    delete_at:Boolean
}

input softdeleteTrainee{
    id:ID!
    delete_at:Boolean
    
}

type Mutation {
    softdeleteTrainee(input: softdeleteTrainee ):Trainee!
}
`
export default Schema