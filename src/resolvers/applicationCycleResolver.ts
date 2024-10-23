import { applicationCycle } from "../models/applicationCycle";
import { traineEAttributes } from "../models/traineeAttribute";
import TraineeApplicant from "../models/traineeApplicant";
import { publishNotification } from "./Adminnotification";
import { ApplicantNotificationsModel } from "../models/applicantNotifications";
import { LoggedUserModel } from "../models/AuthUser";
import { pusher } from "../helpers/pusher";
import { RoleModel } from "../models/roleModel";

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
        await publishNotification(
          `Cycle "${newApplicationCycle.name}" created. Starts: ${newApplicationCycle.startDate}, Ends: ${newApplicationCycle.endDate}.`,
          "Cycle  Created"
        );
        const applicantRole = await RoleModel.findOne({
          roleName: "applicant",
        });
        const applicants = await LoggedUserModel.find({
          role: applicantRole!._id,
        }).populate("role");

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
            .catch((error: any) => {
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
          await publishNotification(
            `Cycle "${applicationCycleToDelete.name}" deleted. It was active from ${applicationCycleToDelete.startDate} to ${applicationCycleToDelete.endDate}`,
            "Cycle Deleted"
          );
          const applicationCycleDeleted =
            await applicationCycle.findByIdAndRemove(_args.id);
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
  },
};
export default applicationCycleResolver;
