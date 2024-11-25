import { sendEmailTemplate } from "../helpers/bulkyMails";
import { LoggedUserModel } from "../models/AuthUser";
import { RoleModel } from "../models/roleModel";
import TechnicalInterview from "../models/technicalInterviewSchema";
import TraineeApplicant from "../models/traineeApplicant";
import { CustomGraphQLError } from "../utils/customErrorHandler";
interface PopulatedCoordinator {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  role: {
    roleName: string;
    description?: string;
    permissions?: string[];
  };
}

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
          .populate({
            path: "coordinatorId",
            model: LoggedUserModel,
            populate: {
              path: "role",
              model: RoleModel,
              select: "roleName",
            },
            select: "firstname lastname email role",
          })
          .exec();
        console.log("Populated Interviews: ", interviews);

        // Optionally filter out coordinators who aren't admin
        const filteredInterviews = interviews.map((interview) => {
          const coordinator =
            interview.coordinatorId as PopulatedCoordinator | null;
          if (
            coordinator &&
            typeof coordinator === "object" &&
            coordinator.role &&
            coordinator.role.roleName === "admin"
          ) {
            interview.coordinatorId = null; // Remove non-admin coordinators
          }

          return interview;
        });

        return filteredInterviews.map((interview) => ({
          _id: interview._id,
          applicant: interview.applicantId,
          coordinator: interview.coordinatorId || null,
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

        // Verify coordinator role
        const coordinator = await LoggedUserModel.findById(
          coordinatorId
        ).populate<{
          role: { roleName: string };
        }>({
          path: "role",
          model: RoleModel,
          select: "roleName",
        });

        if (!coordinator) {
          throw new CustomGraphQLError("Coordinator not found");
        }

        console.log("COORDINATOR'S ROLE =>>>>>>>>>>", coordinator);

        // Allow both admin and superAdmin roles to be coordinators
        if (
          coordinator.role.roleName !== "admin" &&
          coordinator.role.roleName !== "superAdmin"
        ) {
          throw new CustomGraphQLError(
            "The selected coordinator must be an admin or super admin."
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
        const coordinatorData = await LoggedUserModel.findById(coordinatorId);

        // Send email to both applicant and coordinator
        if (applicantData?.email && coordinatorData?.email) {
          const emailTemplate = `
            <p>Date: ${interview.scheduledDate.toLocaleString()}</p>
            Platform: ${interview.meetingPlatform}</br>
            Meeting Link: <a href="${
              interview.meetingLink
            }" target="_blank">Click here to join the meeting</a></br>
            
            Applicant: ${applicantData.firstName} ${applicantData.lastName}</br>
            Technical Coordinator: ${coordinatorData.firstname} ${
            coordinatorData.lastname
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
              coordinatorData.email,
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
