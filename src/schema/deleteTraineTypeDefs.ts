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
input deleteTrainee{
    id:ID!
}

type Query{
    getAllTrainees:[Trainee]
    traineeSchema(id: ID!):Trainee!
}

type Mutation {
    deleteTrainee(id:ID!):Trainee!
    softdeleteTrainee(input: softdeleteTrainee ):Trainee!
}
`
export default Schema