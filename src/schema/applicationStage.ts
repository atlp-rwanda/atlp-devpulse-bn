import { gql } from "apollo-server-core";

export const applicationStageDefs = gql`
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

    addScore(
      applicantId: ID!
      applicantStage: String!
      score: Float!
    ): response!
  }
`;

export const technicalInterviewDefs = gql`
  type TechnicalInterview {
    _id: ID!
    applicant: Applicant!
    coordinator: User
    meetingLink: String!
    scheduledDate: String!
    meetingPlatform: String!
    status: String!
    emailSent: Boolean!
    createdAt: String!
    updatedAt: String!
  }

  input ScheduleInterviewInput {
    applicantId: ID!
    coordinatorId: ID!
    meetingLink: String!
    scheduledDate: String!
    meetingPlatform: String!
  }

  extend type Query {
    getTechnicalInterviews(status: String): [TechnicalInterview!]!
    getTechnicalInterviewById(interviewId: ID!): TechnicalInterview
  }

  extend type Mutation {
    scheduleTechnicalInterview(input: ScheduleInterviewInput!): response!
    updateInterviewStatus(interviewId: ID!, status: String!): response!
  }
`;
