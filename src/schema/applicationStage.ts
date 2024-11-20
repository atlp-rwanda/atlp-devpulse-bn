import { gql } from "apollo-server-core";

export const applicationStageDefs = gql`
  scalar JSON 
  type Applicant {
    _id: ID!
    email: String
    firstName: String
    lastName: String
    delete_at: Boolean
    cycle_id: ID
    applicationPhase: String
    status: String
  }

  type Stage {
    stage: String!
    enteredAt: String!
    exitedAt: String
  }

  type HistoryStage {
    applicantId: ID!
    currentStage: String!
    history: [Stage!]!
  }

  type applicant_records {
    applicant: Applicant
    currentStage: String!
    history: [Stage!]!
  }

  type cycleApplication {
    email: String
    cycle_id: Cycles
    firstName: String 
    lastName: String 
    user: String 
    applicationPhase: String 
    status: String 
    _id:String
    createdAt: String
    coverLetterUrl: String
    resumeUrl: String
    idDocumentUrl: String
  }
  type Cycles {
      name: String
      startDate: String
      endDate: String
      createdAt: String
    } 
  
  type Attributes {
    gender: String
    birth_date: String
    Address: String
    phone:String
    field_of_study:String
    education_level:String
    province:  String
    district:String
    sector: String
    isEmployed:  Boolean
    haveLaptop:Boolean
    isStudent: Boolean
    Hackerrank_score: String
    interview:String
    interview_decision:String
    past_andela_programs: String
    understandTraining: Boolean
    trainee_id: String
  }
  type Stages {
    shortlist:shortlist
    technical:technical
    interview:interview
    admitted:admitted
    dismissed: dismissed
    allStages:allStages
  }
  type  shortlist{
    applicantId:String
    status:String
    comments:String
    createdAt:String
  }
  type technical {
    applicantId:String
    status:String
    score:String
    comments:String
    createdAt:String
  }
  type interview {
    applicantId:String
    status:String
    interviewScore:String
    comments:String
    createdAt:String
  }
  type admitted {
    applicantId: String
    status:String
    comments:String
    createdAt:String
  }
  type dismissed {
    applicantId:String
    stageDismissedFrom: String
    comments:String
    status:String
    createdAt:String
  }
  type StageHistory {
  stage: String
  comments: String
  enteredAt: String
  exitedAt: String
}

type allStages {
  applicantId: String
  currentStage: String
  history: [StageHistory]
}
  type stageByModel {
    applicant: Applicant
    status: String!
    score: Float
    comments: String
    createdAt: String
    updatedAt: String
  }
  type Query {
    getStageHistoryByApplicant(applicantId: ID!): HistoryStage
    getApplicantsByStage(stage: String!): [stageByModel!]!
    getTraineeCyclesApplications: cycleApplication
    getApplicationsAttributes(trainee_id:String!): Attributes
    getApplicationStages(trainee_id:String!):Stages
  }

  type response {
    success: Boolean!
    message: String
  }

  type Mutation {
    moveToNextStage(
      applicantId: ID!
      nextStage: String!
      comments: String
    ): response!

    addScore(applicantId: ID!
    applicantStage: String!
    score: Float!): response!
  }
`;