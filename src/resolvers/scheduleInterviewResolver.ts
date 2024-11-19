import { sendEmailTemplate } from "../helpers/bulkyMails";
import { RoleModel } from "../models/roleModel";
import TechnicalInterview from "../models/technicalInterviewSchema";
import TraineeApplicant from "../models/traineeApplicant";
import { CustomGraphQLError } from "../utils/customErrorHandler";

export const technicalInterviewResolvers = {
  Query: {
    getTechnicalInterviews: async (
      _: any,
      { status }: { status?: string },
      context: any
    ) => {
      try {
        if (!context.currentUser) {
          throw new CustomGraphQLError(
            "You must be logged in to perform this action"
          );
        }

        const query = status ? { status } : {};
        const interviews = await TechnicalInterview.find(query)
          .populate({
            path: "applicantId",
            model: TraineeApplicant,
            select: "firstName lastName email",
          })
          .populate("coordinatorId")
          .exec();

        return interviews.map((interview) => ({
          _id: interview._id,
          applicant: interview.applicantId,
          coordinator: interview.coordinatorId,
          meetingLink: interview.meetingLink,
          scheduledDate: interview.scheduledDate.toISOString(),
          meetingPlatform: interview.meetingPlatform,
          status: interview.status,
          emailSent: interview.emailSent,
        }));
      } catch (error: any) {
        throw new Error(
          `Failed to fetch technical interviews: ${error.message}`
        );
      }
    },

    getTechnicalInterviewById: async (
      _: any,
      { interviewId }: { interviewId: string },
      context: any
    ) => {
      try {
        if (!context.currentUser) {
          throw new CustomGraphQLError(
            "You must be logged in to perform this action"
          );
        }

        const interview = await TechnicalInterview.findById(interviewId)
          .populate("applicantId")
          .populate("coordinatorId")
          .exec();

        if (!interview) {
          throw new Error("Interview not found");
        }

        return {
          _id: interview._id,
          applicant: interview.applicantId,
          coordinator: interview.coordinatorId,
          meetingLink: interview.meetingLink,
          scheduledDate: interview.scheduledDate.toISOString(),
          meetingPlatform: interview.meetingPlatform,
          status: interview.status,
          emailSent: interview.emailSent,
        };
      } catch (error: any) {
        throw new Error(
          `Failed to fetch technical interview: ${error.message}`
        );
      }
    },
  },

  Mutation: {
    scheduleTechnicalInterview: async (
      _: any,
      { input }: { input: any },
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

        const {
          applicantId,
          coordinatorId,
          meetingLink,
          scheduledDate,
          meetingPlatform,
        } = input;

        // Verify applicant is in the correct stage
        const applicant = await TraineeApplicant.findById(applicantId);
        if (!applicant) {
          throw new CustomGraphQLError("Applicant Not found");
        } else if (applicant.applicationPhase !== "Interview Assessment") {
          throw new CustomGraphQLError(
            `Applicant must be in "Interview Assessment" stage`
          );
        }

        const existingInterview = await TechnicalInterview.findOne({
          applicantId,
        });
        if (existingInterview) {
          throw new CustomGraphQLError(
            "An interview has already been scheduled for this applicant."
          );
        }

        // Create interview
        const interview = await TechnicalInterview.create({
          applicantId,
          coordinatorId,
          meetingLink,
          scheduledDate: new Date(scheduledDate),
          meetingPlatform,
        });

        await TraineeApplicant.findByIdAndUpdate(applicantId, {
          $push: { technicalInterviews: interview._id },
        });

        // Get applicant and coordinator details for email
        const applicantData = await TraineeApplicant.findById(applicantId);
        const coordinatorData = await TraineeApplicant.findById(applicantId);

        // Send email to both applicant and coordinator
        if (applicantData?.email && coordinatorData?.email) {
          const emailTemplate = `
          <p>Date: ${interview.scheduledDate.toLocaleString()}</p>
          Platform: ${interview.meetingPlatform}</br>
          Meeting Link: <a href="${
            interview.meetingLink
          }" target="_blank">Click here to join the meeting</a></br>
          
          Applicant: ${applicant.firstName} ${applicant.lastName}</br>
          Technical Coordinator: ${coordinatorData.firstName} ${
            coordinatorData.lastName
          }
        `;
          Promise.all([
            sendEmailTemplate(
              applicantData.email,
              "Technical Interview Scheduled",
              "Technical Interview Details",
              emailTemplate
            ),
            sendEmailTemplate(
              "devpulsedev@gmail.com",
              "Technical Interview Scheduled",
              "Technical Interview Details",
              emailTemplate
            ),
          ]);

          await TechnicalInterview.findByIdAndUpdate(interview._id, {
            emailSent: true,
          });
        }

        return {
          success: true,
          message: "Technical interview scheduled successfully",
        };
      } catch (error: any) {
        return new Error(error.message);
      }
    },

    updateInterviewStatus: async (
      _: any,
      { interviewId, status }: { interviewId: string; status: string },
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

        const interview = await TechnicalInterview.findByIdAndUpdate(
          interviewId,
          { status },
          { new: true }
        );

        if (!interview) {
          throw new Error("Interview not found");
        }

        return {
          success: true,
          message: `Interview status updated to ${status}`,
        };
      } catch (error: any) {
        return new Error(error.message);
      }
    },
  },
};
