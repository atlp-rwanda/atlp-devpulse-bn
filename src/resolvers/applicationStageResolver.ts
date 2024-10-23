import { CustomGraphQLError } from "../utils/customErrorHandler";
import TraineeApplicant from "../models/traineeApplicant";
import StageTracking from "../models/stageSchema";
import { RoleModel } from "../models/roleModel";
export const applicationStageResolvers: any = {
  Query: {
    getStageHistory: async (_: any, { applicantId }: any) => {
      return StageTracking.find({ traineeApplicant: applicantId });
    },
  },
  Mutation: {
    moveToNextStage: async (
      _: any,
      { applicantId, nextStage, comments, score }: any,
      context: any
    ) => {
      try {
        if (!context.currentUser) {
          throw new CustomGraphQLError(
            "You must be logged in to perform this action"
          );
        }

        const userRole = await RoleModel.findById({
          _id: context.currentUser.role,
        });
        if (
          userRole?.roleName !== "admin" &&
          userRole?.roleName !== "superAdmin"
        ) {
          throw new CustomGraphQLError(
            "Only admin and super admins are allowed"
          );
        }

        const currentStage = await StageTracking.findOne({
          traineeApplicant: applicantId,
          exitedAt: { $exists: false },
        });

        if (currentStage && currentStage.stage === nextStage) {
          throw new CustomGraphQLError(
            "The applicant is already in this stage."
          );
        }

        if (currentStage) {
          currentStage.exitedAt = new Date();
          await currentStage.save();
        }
        let newStageData: any = {
          traineeApplicant: applicantId,
          stage: nextStage,
          comments: comments,
          enteredAt: new Date(),
        };

        if (nextStage === "Technical Assessment") {
          if (score === undefined || score < 0 || score > 100) {
            throw new CustomGraphQLError(
              "Score must be between 0 and 100 for Technical Assessment."
            );
          }
          newStageData.score = score;
        } else if (nextStage === "Interview Assessment") {
          if (score === undefined || score < 0 || score > 2) {
            throw new CustomGraphQLError(
              "Interview score must be between 0 and 2."
            );
          }
          
          newStageData.interviewScore = score;
        } else if (nextStage === "Admitted" || nextStage === "Dismissed") {
            newStageData.score = 0;
        }
        const newStage = new StageTracking(newStageData);
        await newStage.save();
        const applicant = await TraineeApplicant.findById(applicantId);
        if (applicant) {
          applicant.applicationPhase = nextStage;
          await applicant.save();
        }

        const stages = await StageTracking.find({
          traineeApplicant: applicantId,
        });

        const formattedStages = stages.map((stage) => ({
          stage: stage.stage,
          comments: stage.comments,
          score: stage.score,
          enteredAt: stage.enteredAt.toLocaleString(),
          exitedAt: stage.exitedAt ? stage.exitedAt.toLocaleString() : null,
        }));

        return {
          id: applicant?._id,
          applicationPhase: applicant?.applicationPhase,
          stages: formattedStages,
        };
      } catch (error: any) {
        return new Error(error.message);
      }
    },
  },
};
