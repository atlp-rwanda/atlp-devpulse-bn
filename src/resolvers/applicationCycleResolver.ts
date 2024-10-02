import { applicationCycle } from "../models/applicationCycle";
import { traineEAttributes } from "../models/traineeAttribute";
import TraineeApplicant from "../models/traineeApplicant";
import { ApplicantNotificationsModel } from "../models/applicantNotifications";

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
      const applicationCycleExists = await applicationCycle.findOne({
        name: _args.name,
      });
      if (applicationCycleExists)
        throw new Error("applicationCycle already exists");
      const newapplicationCycle = await applicationCycle.create({
        name: _args.input.name,
        startDate: _args.input.startDate,
        endDate: _args.input.endDate,
      });

      const applicants = await TraineeApplicant.find({});
      applicants.forEach(async (applicant) => {
        const message = `A new application cycle "${_args.input.name}" is open from ${_args.input.startDate} to ${_args.input.endDate}.`;
        await ApplicantNotificationsModel.create({ userId: applicant._id, message, eventType: "general" });
      });
      return newapplicationCycle;
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
