"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_1 = require("apollo-server");
const Schema = (0, apollo_server_1.gql) `

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
`;
exports.default = Schema;
