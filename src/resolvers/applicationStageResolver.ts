import { CustomGraphQLError } from "../utils/customErrorHandler";
import TraineeApplicant from "../models/traineeApplicant";
import StageTracking from "../models/stageSchema";
import { RoleModel } from "../models/roleModel";
import Shortlisted from "../models/ShortlistedSchema";
import Rejected from "../models/dismissedStageSchema";
import Admitted from "../models/admittedStageSchema";
import InterviewAssessment from "../models/InterviewAssessmentStageSchema";
import TechnicalAssessment from "../models/technicalAssessmentStage";
import { sendEmailTemplate } from "../helpers/bulkyMails";
import { ApplicantNotificationsModel } from "../models/applicantNotifications";
import { LoggedUserModel } from "../models/AuthUser";
import { pusher } from "../helpers/pusher";
import { traineEAttributes } from "../models/traineeAttribute";
import mongoose from "mongoose";
import TechnicalInterview from "../models/technicalInterviewSchema";

const validStages = [
  "Shortlisted",
  "Technical Assessment",
  "Interview Assessment",
  "Admitted",
  "Rejected",
];
const models = [
  Shortlisted,
  TechnicalAssessment,
  InterviewAssessment,
  Admitted,
  Rejected,
];
async function getApplicantsByModel(model: any) {
  return await model.find().populate("applicantId").exec();
}
async function updateApplicantAfterRejected(model: any, applicantId: string) {
  await model.updateOne({ applicantId }, { $set: { status: "Rejected" } });
}
async function updateApplicantAfterAdmitted(model: any, applicantId: string) {
  await model.updateOne({ applicantId }, { $set: { status: "Admitted" } });
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
    getTraineeCyclesApplications: async (_: any, __: any, context: any) => {
      try {
        if (!context.currentUser) {
          throw new CustomGraphQLError(
            "You must be logged in to view your applications"
          );
        }

        const applications = await TraineeApplicant.findOne({
          email: context.currentUser.email,
        })
          .populate("cycle_id")
          .lean();
        return applications;
      } catch (error: any) {
        console.error("Error retrieving applications with attributes:", error);
        throw new CustomGraphQLError(error);
      }
    },
    getApplicationsAttributes: async (
      _: any,
      { trainee_id }: any,
      context: any
    ) => {
      try {
        if (!context.currentUser) {
          throw new CustomGraphQLError(
            "You must be logged in to view your applications"
          );
        }

        const attributes = await traineEAttributes.findOne({ trainee_id });

        return attributes;
      } catch (error) {
        console.error("Error getting attributes:", error);
        throw new CustomGraphQLError(error);
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

        // Fetch interviews for each applicant
        const allApplicantInStages = await Promise.all(
          allApplicantInStage
            .filter((tracking: any) => tracking.applicantId !== null)
            .map(async (tracking: any) => {
              const interviews = await TechnicalInterview.find({
                applicantId: tracking.applicantId,
              }).populate({
                path: "coordinatorId",
                model: LoggedUserModel,
                select: "firstname lastname email",
              });

              return {
                applicant: tracking.applicantId,
                status: tracking.status,
                score: tracking.score || tracking.interviewScore,
                comments: tracking.comments,
                platform: tracking.platform,
                invitationLink: tracking.invitationLink,
                createdAt: tracking.createdAt.toLocaleString(),
                updatedAt: tracking.updatedAt.toLocaleString(),
                technicalInterviews: interviews,
              };
            })
        );

        return allApplicantInStages;
      } catch (error: any) {
        throw new Error(
          `Failed to retrieve applicants for stage ${stage}: ${error.message}`
        );
      }
    },

    // getInterviewStages: async (_: any, __: any, context: any) => {
    //   try {
    //     if (!context.currentUser) {
    //       throw new CustomGraphQLError(
    //         "You must be logged in to view your applications"
    //       );
    //     }

    //     const applicant = await InterviewAssessment.find()
    //       .populate("applicantId")
    //       .exec();
    //     return applicant
    //       .filter((tracking: any) => tracking.applicantId !== null)
    //       .map((tracking: any) => ({
    //         applicant: tracking.applicantId,
    //         status: tracking.status,
    //         score: tracking.score,
    //         comments: tracking.comments,
    //         createdAt: tracking.createdAt.toLocaleString(),
    //         updatedAt: tracking.updatedAt.toLocaleString(),
    //       }));
    //   } catch (err: any) {
    //     throw new Error(`Failed to retrieve applicants ${err.message}`);
    //   }
    // },

    // getInterviewStages: async (_: any, __: any, context: any) => {
    //   try {
    //     if (!validStages.includes(stage)) {
    //       throw new Error("Invalid stage. Please choose a valid stage.");
    //     }
    //     const stageIndex = validStages.indexOf(stage);
    //     const selectedModel = models[stageIndex];
    //     const allApplicantInStage = await getApplicantsByModel(selectedModel);

    //     const applicants = await InterviewAssessment.find()
    //       .populate({
    //         path: "applicantId",
    //         model: "Trainees",
    //         populate: [
    //           {
    //             path: "technicalInterviews",
    //             model: "TechnicalInterview",
    //             populate: {
    //               path: "coordinatorId",
    //               model: LoggedUserModel,
    //               select: "firstname lastname email role",
    //             },
    //           },
    //         ],
    //       })
    //       .exec();

    //     return applicants
    //       .filter((tracking: any) => tracking.applicantId !== null)
    //       .map((tracking: any) => {
    //         const interviews = tracking.applicantId.technicalInterviews || [];
    //         return {
    //           applicant: {
    //             _id: tracking.applicantId._id,
    //             firstName: tracking.applicantId.firstName,
    //             lastName: tracking.applicantId.lastName,
    //             email: tracking.applicantId.email,
    //             applicationPhase: tracking.applicantId.applicationPhase,
    //             status: tracking.applicantId.status,
    //           },
    //           interviews: interviews.map((interview: any) => ({
    //             _id: interview._id,
    //             meetingLink: interview.meetingLink,
    //             meetingPlatform: interview.meetingPlatform,
    //             coordinator: interview.coordinatorId || null,
    //             scheduledDate: interview.scheduledDate?.toISOString(),
    //             status: interview.status,
    //             emailSent: interview.emailSent,
    //             createdAt: interview.createdAt?.toISOString(),
    //             updatedAt: interview.updatedAt?.toISOString(),
    //           })),
    //           status: tracking.status,
    //           score: tracking.interviewScore,
    //           comments: tracking.comments,
    //           createdAt: tracking.createdAt.toLocaleString(),
    //           updatedAt: tracking.updatedAt.toLocaleString(),
    //         };
    //       });
    //   } catch (err: any) {
    //     throw new CustomGraphQLError(
    //       `Failed to retrieve applicants: ${err.message}`
    //     );
    //   }
    // },
  },
  Mutation: {
    moveToNextStage: async (
      _: any,
      { applicantId, nextStage, comments }: any,
      context: any
    ) => {
      try {
        const applicant = await TraineeApplicant.findById(applicantId);
        const user = await LoggedUserModel.findOne({ email: applicant!.email });

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

        let scoreDetails = "";

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
          scoreDetails = `Your Technical Assessment Score: ${technicalScore.score}`;
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
          scoreDetails = `Your Interview Assessment Score: ${interviewScore.interviewScore}`;
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

        let traineeRole = await RoleModel.findOne({ roleName: "trainee" });
        if (!traineeRole) {
          traineeRole = await RoleModel.create({
            roleName: "trainee",
            description: "A user who has been accepted as a trainee",
            permissions: [],
          });
        }

        let message = "";
        switch (nextStage) {
          case "Technical Assessment":
            if (stageTracking) {
              await Shortlisted.updateOne(
                { applicantId, status: "No action" },
                { $set: { status: "Passed" } }
              );
              await TraineeApplicant.updateOne(
                { _id: applicantId },
                { $set: { applicationPhase: nextStage, status: "Passed" } }
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
            message = `You have advanced to the ${nextStage} stage.`;
            const notification = await ApplicantNotificationsModel.create({
              userId: user!._id,
              message,
              eventType: "applicationUpdate",
            });

            await sendEmailTemplate(
              user!.email,
              "Application Update",
              `Hello ${user!.email.split("@")[0]}, `,
              `Your application has been moved to ${nextStage} stage.
                    <br />
                    You will hear from us very soon.
                    <br />
                    Thank you for your patience.
              `
            );

            await pusher
              .trigger(`notifications-${user!._id}`, "new-notification", {
                message: notification.message,
                id: notification._id,
                createdAt: notification.createdAt,
                read: notification.read,
                eventType: "applicationUpdate",
              })
              .catch((error) => {
                console.error("Error with Pusher trigger:", error);
              });
            break;

          case "Interview Assessment":
            if (stageTracking) {
              await TechnicalAssessment.updateOne(
                { applicantId, status: "No action" },
                { $set: { status: "Passed" } }
              );
              await TraineeApplicant.updateOne(
                { _id: applicantId },
                { $set: { applicationPhase: nextStage, status: "Passed" } }
              );
            }
            await InterviewAssessment.create({
              applicantId,
              comments,
              status: "No action",
            });
            message = `You have advanced to the ${nextStage} stage.`;
            const notification1 = await ApplicantNotificationsModel.create({
              userId: user!._id,
              message,
              eventType: "applicationUpdate",
            });

            await sendEmailTemplate(
              user!.email,
              "Application Update",
              `Hello ${user!.email.split("@")[0]}, `,
              `Your application has been moved to ${nextStage} stage.
                  <br />
                   ${scoreDetails}
                   <br />
                    <br />
                    You will hear from us very soon.
                    <br />
                    Thank you for your patience.
              `
            );

            await pusher
              .trigger(`notifications-${user!._id}`, "new-notification", {
                message: notification1.message,
                id: notification1._id,
                createdAt: notification1.createdAt,
                read: notification1.read,
                eventType: "applicationUpdate",
              })
              .catch((error) => {
                console.error("Error with Pusher trigger:", error);
              });
            break;

          case "Admitted":
            if (stageTracking) {
              await InterviewAssessment.updateOne(
                { applicantId, status: "No action" },
                { $set: { status: "Passed" } }
              );
            }

            await Promise.all(
              models.map((model) =>
                updateApplicantAfterAdmitted(model, applicantId)
              )
            );

            await Admitted.create({
              applicantId,
              comments,
              status: "Passed",
            });
            message = `You have passed the application stage✅.`;
            await TraineeApplicant.updateOne(
              { _id: applicantId },
              {
                $set: {
                  applicationPhase: nextStage,
                  status: "Admitted",
                  role: traineeRole._id,
                },
              }
            );
            const updatedApplicant = await TraineeApplicant.findOne({
              _id: applicantId,
            })
              .populate("email")
              .lean();

            const email = updatedApplicant?.email;

            if (email) {
              await LoggedUserModel.updateOne(
                { email },
                {
                  $set: {
                    applicationPhase: nextStage,
                    status: "Admitted",
                    role: traineeRole._id,
                  },
                }
              );
            } else {
              throw new Error("Email not found for the provided applicant ID");
            }
            const notification2 = await ApplicantNotificationsModel.create({
              userId: user!._id,
              message,
              eventType: "applicationUpdate",
            });

            await sendEmailTemplate(
              user!.email,
              "Application Update",
              `Hello ${user!.email.split("@")[0]}, `,
              `Your application has successfully passed the application stage.
                   <br />
                   ${scoreDetails}
                   <br /> 
                    <br />
                    You will hear from us very soon.
                    <br />
                    Thank you for your patience.
              `
            );

            await pusher
              .trigger(`notifications-${user!._id}`, "new-notification", {
                message: notification2.message,
                id: notification2._id,
                createdAt: notification2.createdAt,
                read: notification2.read,
                eventType: "applicationUpdate",
              })
              .catch((error) => {
                console.error("Error with Pusher trigger:", error);
              });
            break;

          case "Rejected":
            if (stageTracking && stageTracking.currentStage) {
              await StageTracking.updateOne(
                { applicantId, currentStage: stageTracking.currentStage },
                { $set: { status: "Rejected", exitedAt: new Date() } }
              );
            }
            await Promise.all(
              models.map((model) =>
                updateApplicantAfterRejected(model, applicantId)
              )
            );
            const stageRejectedFrom = await TraineeApplicant.findOne({
              _id: applicantId,
            });
            await Rejected.create({
              applicantId,
              stageRejectedFrom: stageRejectedFrom?.applicationPhase,
              comments,
            });
            await TraineeApplicant.updateOne(
              { _id: applicantId },
              { $set: { applicationPhase: "Rejected", status: "Rejected" } }
            );
            message = `You have been rejected from the ${stageRejectedFrom?.applicationPhase} stage.`;

            const notification3 = await ApplicantNotificationsModel.create({
              userId: user!._id,
              message,
              eventType: "applicationUpdate",
            });

            await sendEmailTemplate(
              user!.email,
              "Application Update",
              `Hello ${user!.email.split("@")[0]}, `,
              `We are sorry to inform you that 
              your application has been rejected from the ${stageRejectedFrom?.applicationPhase} stage.
                    <br />
                    <br />
                    You can always apply again.
              `
            );

            await pusher
              .trigger(`notifications-${user!._id}`, "new-notification", {
                message: notification3.message,
                id: notification3._id,
                createdAt: notification3.createdAt,
                read: notification3.read,
                eventType: "applicationUpdate",
              })
              .catch((error) => {
                console.error("Error with Pusher trigger:", error);
              });
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
            message = `You have advanced to the ${nextStage} stage.`;
            const notification4 = await ApplicantNotificationsModel.create({
              userId: user!._id,
              message,
              eventType: "applicationUpdate",
            });

            await sendEmailTemplate(
              user!.email,
              "Application Update",
              `Hello ${user!.email.split("@")[0]}, `,
              `Your application has been moved to ${nextStage} stage.
                    <br />
                    You will hear from us very soon.
                    <br />
                    Thank you for your patience.
              `
            );

            await pusher
              .trigger(`notifications-${user!._id}`, "new-notification", {
                message: notification4.message,
                id: notification4._id,
                createdAt: notification4.createdAt,
                read: notification4.read,
                eventType: "applicationUpdate",
              })
              .catch((error) => {
                console.error("Error with Pusher trigger:", error);
              });
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
              { applicantId },
              { $set: { score } }
            );
            break;
          case "Interview Assessment":
            await InterviewAssessment.updateOne(
              { applicantId },
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
    sendInvitation: async (
      _: any,
      {
        applicantId,
        email,
        platform,
        invitationLink,
      }: {
        applicantId: string;
        email: string;
        platform: string;
        invitationLink: string;
      },
      context: any
    ) => {
      try {
        if (!context.currentUser) {
          throw new CustomGraphQLError(
            "You must be logged in to perform this action."
          );
        }

        if (!email || !invitationLink) {
          throw new CustomGraphQLError(
            "Email and invitation link are required."
          );
        }

        // Find the applicant
        const isApplicantExist = await TechnicalAssessment.findOne({
          applicantId,
        })
          .populate("applicantId")
          .exec();

        if (!isApplicantExist || !isApplicantExist.applicantId) {
          throw new Error("Applicant not found or applicantId is missing.");
        }

        const user = await LoggedUserModel.findOne({ email });
        const applicant = isApplicantExist.applicantId as any;
        const firstName = applicant.firstName;
        const lastName = applicant.lastName;
        const notification = await ApplicantNotificationsModel.create({
          userId: user!._id,
          message:
            "Invitation link has sent to your email address. Please check your email address",
          eventType: "general",
        });
        await pusher
          .trigger(`notifications-${user!._id}`, "new-notification", {
            message: notification.message,
            id: notification._id,
            createdAt: notification.createdAt,
            read: notification.read,
          })
          .catch((error) => {
            console.error("Error with Pusher trigger:", error);
          });
        await sendEmailTemplate(
          email,
          "Invitation to Complete Technical Assessment",
          `Dear ${firstName} ${lastName},`,
          ` <p>
            We are excited to invite you to take the next step in your application process! <br>
            Please complete the following technical assessment to continue:<br>
            <a href="${invitationLink}" target="_blank">${invitationLink}</a><br>
            The assessment will be hosted on the <strong>${platform}</strong> platform. Please ensure that you have the necessary access and requirements ready.
            </p>
            <p>
            Once you've finished the assessment, we'll review your results and follow up with the next steps.
            </p>
          `,
          {
            text: "Invitation link",
            url: invitationLink,
          }
        );

        await TraineeApplicant.updateOne(
          { _id: applicantId },
          { $set: { status: "Invited" } }
        );
        await TechnicalAssessment.updateOne(
          { applicantId },
          { $set: { status: "Invited", invitationLink, platform } }
        );

        return {
          success: true,
          message: "Invitation sent successfully",
        };
      } catch (error: any) {
        return {
          success: false,
          message: error.message,
        };
      }
    },
  },
};
