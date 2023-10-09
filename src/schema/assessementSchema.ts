import { gql } from "apollo-server";
const Schema=`
type Assessement_Outputs {
    id: String
    createdAt: String
    title: String
    description: String
    engagement: String
    duration: String
    program: ProgramModel
    startDate: String
    endDate: String
  }

  input Assessement_Inputs {
    title: String
    description: String
    engagement: String
    duration: String
    program: String
    startDate: String
    endDate: String
  }
  input EditAssessement_input {
    title: String
  }

  type Query {
    assignment(ID: ID!):Assessement_Outputs!
    getAssessements(amount: Int): [Assessement_Outputs]
  }

  type Mutation {
    createAssessement(assessementInput: Assessement_Inputs):Assessement_Outputs!
  }
`