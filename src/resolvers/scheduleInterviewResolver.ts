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
          createdAt: interview.createdAt,
          updatedAt: interview.updatedAt,
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

        if (applicantData?.email && coordinatorData?.email) {
          const applicantEmailTemplate = `
          <!DOCTYPE html>
  <html lang="en">
<head>
  <meta charset="UTF-8">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: white;
      padding: 20px;
      box-shadow: 0 0 10px rgba(0,0,0,0.1);
    }
    .header {
      background-color: #f8f9fa;
      padding: 15px;
      text-align: center;
      border-bottom: 1px solid #e9ecef;
    }
    .content {
      padding: 20px;
    }
    .button {
      display: inline-block;
      background-color: #28a745;
      color: white;
      padding: 12px 24px;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 600;
      margin: 20px 0;
      text-align: center;
    }
    .button-container {
      text-align: center;
      width: 100%;
    }
    p {
      margin-bottom: 15px;
    }
    ul, ol {
      margin-bottom: 15px;
      padding-left: 20px;
    }
    .footer {
      text-align: center;
      padding: 10px;
      background-color: #f8f9fa;
      font-size: 12px;
      color: #6c757d;
      border-top: 1px solid #e9ecef;
    }
    .congratulations {
      background-color: #c9ead0;
      border-left: 4px solid #28a745;
      padding: 15px;
      margin-bottom: 20px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Technical Interview Invitation</h1>
    </div>
    
    <div class="content">
      <div class="congratulations">
        <p><strong>Congratulations, ${applicantData.firstName}!</strong></p>
        <p>We are pleased to inform you that you have successfully passed the technical assessment. Your performance demonstrated exceptional problem-solving skills and technical proficiency.</p>
      </div>

      <p>Dear ${applicantData.firstName} ${applicantData.lastName},</p>
      
      <p>You have been invited for a technical interview. Here are the details:</p>
      
      <p>
        <strong>Date:</strong> ${interview.scheduledDate.toLocaleString(
          "en-US",
          { dateStyle: "full", timeStyle: "long" }
        )}
        <br>
        <strong>Platform:</strong> ${interview.meetingPlatform}
      </p>
      
      <p>Preparation Guidelines:</p>
      <ul>
        <li>Ensure a stable internet connection</li>
        <li>Find a quiet, professional space</li>
        <li>Test your audio and video equipment</li>
        <li>Prepare your resume and portfolio</li>
      </ul>
      
      <div class="button-container">
        <a href="${interview.meetingLink}" class="button">
          Join Interview Meeting
        </a>
      </div>
    </div>
    
    <div class="footer">
      © 2024 Recruitment Team | Good Luck with Your Interview!
    </div>
  </div>
</body>
</html>`;

          const coordinatorEmailTemplate = `
          <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: white;
      padding: 20px;
      box-shadow: 0 0 10px rgba(0,0,0,0.1);
    }
    .header {
      background-color: #f8f9fa;
      padding: 15px;
      text-align: center;
      border-bottom: 1px solid #e9ecef;
    }
    .content {
      padding: 20px;
    }
    .button {
      display: inline-block;
      background-color: #28a745;
      color: #fff;
      padding: 12px 24px;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 600;
      margin: 20px 0;
      text-align: center;
    }
    .button-container {
      text-align: center;
      width: 100%;
    }
    p {
      margin-bottom: 15px;
    }
    ul, ol {
      margin-bottom: 15px;
      padding-left: 20px;
    }
    .footer {
      text-align: center;
      padding: 10px;
      background-color: #f8f9fa;
      font-size: 12px;
      color: #6c757d;
      border-top: 1px solid #e9ecef;
    }
    .congratulations {
      background-color: #e7f3fe;
      border-left: 4px solid #28a745;
      padding: 15px;
      margin-bottom: 20px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Technical Interview Assignment</h1>
    </div>
    
    <div class="content">
      <div class="congratulations">
        <p><strong>Notice!</strong></p>
        <p>We are pleased to inform you that the candidate has successfully passed the technical assessment. Their performance demonstrated exceptional problem-solving skills and technical proficiency.
        You have been selected as the interview coordinator.</p>
      </div>

      <p>Dear ${coordinatorData.firstname} ${coordinatorData.lastname},</p>
      
      <p>A technical interview has been scheduled. Here are the details:</p>
      
      <p>
        <strong>Date:</strong> ${interview.scheduledDate.toLocaleString(
          "en-US",
          { dateStyle: "full", timeStyle: "long" }
        )}
        <br>
        <strong>Platform:</strong> ${interview.meetingPlatform}
      </p>
      
      <p>Applicant Information:</p>
      <ul>
        <li><strong>Name:</strong> ${applicantData.firstName} ${
            applicantData.lastName
          }</li>
        <li><strong>Email:</strong> ${applicantData.email}</li>
        <li><strong>Application Phase:</strong> Interview Assessment</li>
      </ul>
      
      <p>Interview Preparation Checklist:</p>
      <ol>
        <li>Review applicant's profile</li>
        <li>Prepare technical assessment criteria</li>
        <li>Have a structured interview plan</li>
        <li>Evaluate problem-solving skills</li>
        <li>Document interview observations</li>
      </ol>
      
      <div class="button-container">
        <a href="${interview.meetingLink}" class="button">
          Enter Interview Room
        </a>
      </div>
    </div>
    
    <div class="footer">
      © 2024 Recruitment Team | Professional Interview Management
    </div>
  </div>
</body>
</html>
`;

          // Send emails
          await Promise.all([
            sendEmailTemplate(
              applicantData.email,
              "Technical Interview Invitation",
              "",
              applicantEmailTemplate
            ),
            sendEmailTemplate(
              coordinatorData.email,
              "Technical Interview Assignment",
              "",
              coordinatorEmailTemplate
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
