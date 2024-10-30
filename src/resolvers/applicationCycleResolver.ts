import { applicationCycle } from "../models/applicationCycle";
import { traineEAttributes } from "../models/traineeAttribute";
import TraineeApplicant from "../models/traineeApplicant";
import { ApplicantNotificationsModel } from "../models/applicantNotifications";
import { LoggedUserModel } from "../models/AuthUser";
import { pusher } from "../helpers/pusher";
import { RoleModel } from "../models/roleModel";
import { publishNotification } from "./adminNotificationsResolver";
import { CustomGraphQLError } from "../utils/customErrorHandler";

const applicationCycleResolver: any = {
  Query: {
    async getAllApplicationCycles() {
      const getcohortCycles = await applicationCycle.find({});
      return getcohortCycles;
    },
    async applicationCycle(parent: any, args: any) {
      const getOneapplicationCycle = await applicationCycle.findById(args.id);
      if (!applicationCycle) throw new Error("This cohort cycle doesn't exist");
      return getOneapplicationCycle;
    },
    getTraineeCyclesApplications: async (_: any, __: any, context: any) => {
      try {
        if (!context.currentUser) {
          throw new CustomGraphQLError("You must be logged in to view your applications");
        }


        const applications = await TraineeApplicant.find({ user: context.currentUser._id })
        return applications;
      } catch (error: any) {
        throw new CustomGraphQLError(error.message);
      }
    }
  },
  Mutation: {
    async createApplicationCycle(_parent: any, _args: any) {
      try {
        const applicationCycleExists = await applicationCycle.findOne({
          name: _args.input.name,
        });
        if (applicationCycleExists) {
          throw new Error("Application cycle already exists");
        }

        const newApplicationCycle = await applicationCycle.create({
          name: _args.input.name,
          startDate: _args.input.startDate,
          endDate: _args.input.endDate,
        });

        const applicantRole = await RoleModel.findOne({ roleName: "applicant" });
        const applicants = await LoggedUserModel.find({ role: applicantRole!._id }).populate('role');
        await publishNotification(
          `Cycle "${newApplicationCycle.name}" created. Starts: ${newApplicationCycle.startDate}, Ends: ${newApplicationCycle.endDate}.`,
          "Cycle  Created"
        );
        const notificationPromises = applicants.map(async (applicant) => {
          const message = `A new application cycle "${_args.input.name}" is open from ${_args.input.startDate} to ${_args.input.endDate}.`;

          const notification = await ApplicantNotificationsModel.create({
            userId: applicant._id,
            message,
            eventType: "general",
          });

          await pusher
            .trigger(`notifications-${applicant._id}`, "new-notification", {
              message: notification.message,
              id: notification._id,
              createdAt: notification.createdAt,
              read: notification.read,
            })
            .catch((error) => {
              console.error("Error with Pusher trigger:", error);
            });

          return notification;
        });

        await Promise.all(notificationPromises);

        return newApplicationCycle;
      } catch (error) {
        console.error("Error in createApplicationCycle:", error);
        throw new Error("Failed to create application cycle");
      }
    },
    async deleteApplicationCycle(_parent: any, _args: any) {
      const applicationCycleToDelete = await applicationCycle.findById(
        _args.id
      );
      if (applicationCycleToDelete != null) {
        const user = await TraineeApplicant.findOne({ cycle_id: _args.id });
        if (user) {
          throw new Error(`cycle has some applicants`);
        } else {
          const applicationCycleDeleted =
            await applicationCycle.findByIdAndRemove(_args.id);
            await publishNotification(
              `Cycle "${applicationCycleToDelete.name}" deleted. It was active from ${applicationCycleToDelete.startDate} to ${applicationCycleToDelete.endDate}`,
              "Cycle Deleted"); 
          return applicationCycleDeleted;
        }
      } else {
        throw new Error("This applicationCycle doesn't exist");
      }
    },
    async updateApplicationCycle(_parent: any, _args: any) {
      const newapplicationCycle = await applicationCycle.findByIdAndUpdate(
        _args.id,
        {
          name: _args.input.name,
          startDate: _args.input.startDate,
          endDate: _args.input.endDate,
        },
        { new: true }
      );
      if (newapplicationCycle) {
        await publishNotification(
          `Cycle "${newapplicationCycle.name}" updated. New start: ${newapplicationCycle.startDate}, end: ${newapplicationCycle.endDate}`,
          "Cycle  Updated"
        );
      }
      const applicants = await TraineeApplicant.find({});
      applicants.forEach(async (applicant) => {
        const message = `An update on the application cycle "${_args.input.name}" has been made.`;
        await ApplicantNotificationsModel.create({
          userId: applicant._id,
          message,
          eventType: "general",
        });
      });
      return newapplicationCycle;
    },
    applyCycle: async (_: any, { input }: any, context: any) => {
      const { cycle_id } = input;
      try {
        if (!context.currentUser) {
          throw new CustomGraphQLError("You must be logged in to apply in the Cycle");
        }

        const [userRole, isUserAlreadyApplied] = await Promise.all([
          RoleModel.findById(context.currentUser.role),
          TraineeApplicant.findOne({ user: context.currentUser._id, cycle_id }),
        ]);

        if (isUserAlreadyApplied) {
          return { message: "You have already applied to this Cycle" };
        }

        let newApplicationData = {
          user: context.currentUser._id,
          email: context.currentUser.email,
          firstName: context.currentUser.firstName || " ",
          lastName: context.currentUser.lastName || " ",
          cycle_id: cycle_id,
        };

        const newApplication = new TraineeApplicant(newApplicationData);
        await newApplication.save();

        return { message: "Application submitted successfully" };
      } catch (error: any) {
        throw new CustomGraphQLError(error.message);
      }
    }

  },
};
export default applicationCycleResolver;