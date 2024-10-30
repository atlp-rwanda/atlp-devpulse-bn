import { gql } from "apollo-server";
const Schema = gql`
  type applicationCycle {
    id: ID!
    name: String!
    startDate: String!
    endDate: String!
  }

  input createApplicationCycle {
    name: String!
    startDate: String!
    endDate: String!
  }

  input updateApplicationCycle {
    id: ID!
    name: String!
    startDate: String!
    endDate: String!
  }

  input deleteApplicationCycle {
    id: ID!
  }

  # New input for applyCycle mutation
  input applyCycleInput {
    cycle_id: ID!
  }

  # New type for applyCycle response
  type ApplyCycleResponse {
    message: String!
  }
  type CycleApplications {
    cycle_id: ID!
    firstName: String!
    lastName: String!
    email: String!
    user: String!
    applicationPhase: String!
    status: String! 
    _id:String!   
  }

  type Query {
    getAllApplicationCycles: [applicationCycle]
    applicationCycle(id: ID!): applicationCycle!
    getTraineeCyclesApplications: [CycleApplications]
  }

  type Mutation {
    createApplicationCycle(input: createApplicationCycle): applicationCycle!
    deleteApplicationCycle(id: ID!): applicationCycle!
    updateApplicationCycle(id: ID!, input: updateApplicationCycle): applicationCycle!
    
    # Define the applyCycle mutation
    applyCycle(input: applyCycleInput): ApplyCycleResponse!
  }
`;

export default Schema;