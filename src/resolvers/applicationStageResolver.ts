import { CustomGraphQLError } from "../utils/customErrorHandler";
import TraineeApplicant from "../models/traineeApplicant";
import StageTracking from "../models/stageSchema";
import { RoleModel } from "../models/roleModel";
import Shortlisted from "../models/ShortlistedSchema";
import Dismissed from "../models/dismissedStageSchema";
import Admitted from "../models/admittedStageSchema";
import InterviewAssessment from "../models/InterviewAssessmentStageSchema";
import TechnicalAssessment from "../models/technicalAssessmentStage";

const validStages = [
  "Shortlisted",
  "Technical Assessment",
  "Interview Assessment",
  "Admitted",
  "Dismissed",
];
const models = [
  Shortlisted,
  TechnicalAssessment,
  InterviewAssessment,
  Admitted,
  Dismissed,
];
async function getApplicantsByModel(model: any) {
  return await model.find().populate("applicantId").exec();
}
async function updateApplicantAfterDismissed(model: any, applicantId: string) {
  await model.updateOne({ applicantId }, { $set: { status: "Dismissed" } });
}
export const applicationStageResolvers: any = {
  Query: {
    getStageHistoryByApplicant: async (
      _: any,
      { applicantId }: { applicantId: string }
    ) => {
      try {
        const stageTracking = await StageTracking.findOne({
          applicantId,
        }).exec();
        if (!stageTracking) {
          throw new Error("Applicant not found or has no stage history.");
        }

        const historyArray = Array.isArray(stageTracking.history)
          ? stageTracking.history
          : [];

        return {
          applicantId: stageTracking.applicantId,
          currentStage: stageTracking.currentStage,
          history: historyArray.map((stage) => ({
            stage: stage.stage,
            enteredAt: stage.enteredAt.toISOString(),
            exitedAt: stage.exitedAt ? stage.exitedAt.toISOString() : null,
          })),
        };
      } catch (error: any) {
        throw new Error(
          `Failed to retrieve applicant history: ${error.message}`
        );
      }
    },
    getApplicantsByStage: async (_: any, { stage }: { stage: string }) => {
      try {
        if (!validStages.includes(stage)) {
          throw new Error("Invalid stage. Please choose a valid stage.");
        }
        const stageIndex = validStages.indexOf(stage);
        const selectedModel = models[stageIndex];
        const allApplicantInStage = await getApplicantsByModel(selectedModel);
        return allApplicantInStage
          .filter((tracking: any) => tracking.applicantId !== null)
          .map((tracking: any) => ({
            applicant: tracking.applicantId,
            status: tracking.status,
            score: tracking.score || tracking.interviewScore,
            comments: tracking.comments,
            createdAt: tracking.createdAt.toLocaleString(),
            updatedAt: tracking.updatedAt.toLocaleString(),
          }));
      } catch (error: any) {
        throw new Error(
          `Failed to retrieve applicants for stage ${stage}: ${error.message}`
        );
      }
    },
  },
  Mutation: {
    moveToNextStage: async (
      _: any,
      { applicantId, nextStage, comments }: any,
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

        let stageTracking = await StageTracking.findOne({
          applicantId,
          exitedAt: { $exists: false },
        });

        if (stageTracking?.currentStage === nextStage) {
          return new CustomGraphQLError(
            "The applicant is already in this stage."
          );
        }

        if (nextStage === "Interview Assessment") {
          const technicalScore = await TechnicalAssessment.findOne({
            applicantId,
          });
          if (
            !technicalScore ||
            technicalScore.score === undefined ||
            technicalScore.score === null
          ) {
            return new CustomGraphQLError(
              "Technical assessment score is required before moving to the Interview Assessment, Please add score😎."
            );
          }
        }

        // If moving to Admitted, ensure Interview Assessment has a score
        if (nextStage === "Admitted") {
          const interviewScore = await InterviewAssessment.findOne({
            applicantId,
          });
          if (
            !interviewScore ||
            interviewScore.interviewScore === undefined ||
            interviewScore.interviewScore === null
          ) {
            return new CustomGraphQLError(
              "Interview assessment score is required before moving to Admitted, Please add score😎."
            );
          }
        }

        if (!stageTracking) {
          stageTracking = new StageTracking({
            applicantId,
            currentStage: nextStage,
            history: [],
          });
          await stageTracking.save();
        } else {
          stageTracking.history.push({
            stage: stageTracking.currentStage,
            comments,
            enteredAt:
              stageTracking.history[stageTracking.history.length - 1]
                ?.enteredAt || new Date(),
            exitedAt: new Date(),
          });

          stageTracking.currentStage = nextStage;
          await stageTracking.save();
        }

        let message = "";
        switch (nextStage) {
          case "Technical Assessment":
            if (stageTracking) {
              await Shortlisted.updateOne(
                { applicantId, status: "No action" },
                { $set: { status: "Moved" } }
              );
              await TraineeApplicant.updateOne(
                { _id: applicantId },
                { $set: { applicationPhase: nextStage, status: "Moved" } }
              );
            }

            await TechnicalAssessment.create({
              applicantId,
              comments,
              status: "No action",
            });
            await TraineeApplicant.updateOne(
              { _id: applicantId },
              { $set: { applicationPhase: nextStage, status: "No action" } }
            );
            message = `Applicant advanced to ${nextStage} stage.`;
            break;

          case "Interview Assessment":
            if (stageTracking) {
              await TechnicalAssessment.updateOne(
                { applicantId, status: "No action" },
                { $set: { status: "Moved" } }
              );
              await TraineeApplicant.updateOne(
                { _id: applicantId },
                { $set: { applicationPhase: nextStage, status: "Moved" } }
              );
            }
            await InterviewAssessment.create({
              applicantId,
              comments,
              status: "No action",
            });
            message = `Applicant advanced to ${nextStage} stage.`;
            break;

          case "Admitted":
            if (stageTracking) {
              await InterviewAssessment.updateOne(
                { applicantId, status: "No action" },
                { $set: { status: "Moved" } }
              );
            }

            await Admitted.create({
              applicantId,
              comments,
              status: "Passed",
            });
            message = `Applicant passed the application stage✅.`;
            await TraineeApplicant.updateOne(
              { _id: applicantId },
              { $set: { applicationPhase: nextStage, status: "Admitted" } }
            );

            break;

          case "Dismissed":
            if (stageTracking && stageTracking.currentStage) {
              await StageTracking.updateOne(
                { applicantId, currentStage: stageTracking.currentStage },
                { $set: { status: "Dismissed", exitedAt: new Date() } }
              );
            }
            await Promise.all(models.map(model => updateApplicantAfterDismissed(model, applicantId)));
            const stageDismissedFrom = await TraineeApplicant.findOne({
              _id: applicantId,
            });
            await Dismissed.create({
              applicantId,
              stageDismissedFrom: stageDismissedFrom?.applicationPhase,
              comments,
            });
            await TraineeApplicant.updateOne(
              { _id: applicantId },
              { $set: { applicationPhase: "Dismissed", status: "Dismissed" } }
            );
            message = `Applicant dismissed from the ${stageDismissedFrom?.applicationPhase} stage.`;
            break;

          case "Shortlisted":
            if (stageTracking) {
              await StageTracking.updateOne(
                { applicantId, currentStage: stageTracking.currentStage },
                { $set: { status: "Moved", exitedAt: new Date() } }
              );
            }

            await Shortlisted.create({
              applicantId,
              comments,
              status: "No action",
            });
            await TraineeApplicant.updateOne(
              { _id: applicantId },
              { $set: { applicationPhase: nextStage, status: "No action" } }
            );
            message = `Applicant advanced to ${nextStage} stage.`;
            break;
        }

        return {
          success: true,
          message,
        };
      } catch (error: any) {
        return new Error(error.message);
      }
    },
    addScore: async (
      _: any,
      {
        applicantId,
        applicantStage,
        score,
      }: { applicantId: string; applicantStage: string; score: number },
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

        if (!score) {
          throw new CustomGraphQLError("Score is required");
        }

        switch (applicantStage) {
          case "Technical Assessment":
            await TechnicalAssessment.updateOne(
              { applicantId, status: "No action" },
              { $set: { score } }
            );
            break;
          case "Interview Assessment":
            await InterviewAssessment.updateOne(
              { applicantId, status: "No action" },
              { $set: { interviewScore: score } }
            );
            break;
          default:
            throw new CustomGraphQLError(
              `Invalid stage. Please choose Technical Assessment or Interview Assessment.`
            );
        }
        return {
          success: true,
          message: "Score added successfully",
        };
      } catch (error: any) {
        return new Error(error.message);
      }
    },
  },
};
