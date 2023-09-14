import { gql } from "apollo-server";
const Schema = gql`

type candidateApplication{
    message:String!
}

input deleteCandidateApplication{
    id:ID!
}


type Mutation {
    deleteCandidateApplication(id:ID!):candidateApplication!
}
`
export default Schema