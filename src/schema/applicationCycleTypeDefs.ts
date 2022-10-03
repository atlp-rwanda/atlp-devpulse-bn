import { gql } from "apollo-server";
const Schema = gql`

type applicationCycle{
    id:ID!
    name:String!
    startDate:String!
    endDate:String!
}

input createApplicationCycle{
    name:String!
    startDate:String!
    endDate:String!
}
input updateApplicationCycle{
    id:ID!
    name:String!
    startDate:String!
    endDate:String!
}
input deleteApplicationCycle{
    id:ID!
}

type Query{
    getAllApplicationCycles:[applicationCycle]
    applicationCycle(id: ID!):applicationCycle!
}

type Mutation {
    createApplicationCycle(input: createApplicationCycle):applicationCycle!
    deleteApplicationCycle(id:ID!):applicationCycle!
    updateApplicationCycle(id:ID!, input: updateApplicationCycle):applicationCycle!
}
`
export default Schema