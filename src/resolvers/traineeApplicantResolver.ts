import TraineeApplicant from "../models/traineeApplicant";
import { traineEAttributes } from "../models/traineeAttribute";
import { applicationCycle } from "../models/applicationCycle";
import mongoose, { ObjectId } from "mongoose";
import { sendEmailTemplate } from "../helpers/bulkyMails";
import { Types } from 'mongoose';
import { AuthenticationError } from 'apollo-server';
import { LoggedUserModel } from "../models/AuthUser";
import { RoleModel } from "../models/roleModel";

const FrontendUrl = process.env.FRONTEND_URL || "";

import { CustomGraphQLError } from "../utils/customErrorHandler";
import { cohortModels } from "../models/cohortModel";
import { publishNotification } from "./adminNotificationsResolver";
import { any } from "joi";


interface Context {
  currentUser: { _id: string };
}

export const traineeApplicantResolver: any = {
  Query: {
    async allTrainees(_: any, { input }: any) {
      const { page, itemsPerPage, All } = input;
      let pages;
      let items;

      const totalItems = await TraineeApplicant.countDocuments({});
      if (page && page > 1) {
        pages = page;
      } else {
        pages = 1;
      }
      if (All) {
        items = totalItems;
      } else {
        if (itemsPerPage && itemsPerPage > 0) {
          items = itemsPerPage;
        } else {
          items = 3;
        }
      }

      const itemsToSkip = (pages - 1) * items;
      const allTrainee = await TraineeApplicant.find({ delete_at: false })
        .populate("cycle_id")

        .skip(itemsToSkip)
        .limit(items);

      const formattedTrainees = allTrainee.map((trainee) => ({
        ...trainee.toObject(),
        createdAt: trainee.createdAt.toLocaleString(), // Format createdAt as ISO string
      }));
      return {
        data: formattedTrainees,
        totalItems,
        page: pages,
        itemsPerPage: items,
      };
    },

    async getOneTrainee(_: any, { ID }: any) {
      const trainee = await TraineeApplicant.findById(ID).populate("cycle_id");
      if (!trainee)
        throw new Error("No trainee is found, pleade provide the correct ID");
      return trainee;
    },

    async getTraineeByUserId(_: any, { userId }: any) {
      const trainee = await TraineeApplicant.findOne({ user: userId });

      if (!trainee) {
        throw new Error("Trainee not found");
      }

      return trainee._id;
    },
  },

  Mutation: {
    async updateTraineeApplicant(parent: any, args: any, context: any) {
      const { ID, updateInput } = args;

      if (updateInput.cycle_id) {
        const cycle = await applicationCycle.findById(updateInput.cycle_id);
        if (!cycle) {
          throw new Error("the cycle provided does not exist");
        }
      }
      const updated = await TraineeApplicant.findByIdAndUpdate(
        ID,
        {
          firstName: updateInput.firstName,
          lastName: updateInput.lastName,
          status: updateInput.status,
          cycle_id: new mongoose.Types.ObjectId(updateInput.cycle_id),
        },
        { new: true }
      ).populate("cycle_id");

      return updated;
    },

    async deleteTraineeApplicant(parent: any, args: any, context: any) {
      const emailInput = args.email;
      const oneTraineeApplicant = await TraineeApplicant.findOne({
        email: emailInput,
      })
        .populate("cycle_id")
        .exec();
      const idToDelete = oneTraineeApplicant?._id;
      const trainee = await TraineeApplicant.deleteOne({ email: emailInput });
      if (trainee.deletedCount) {
        const upDate = await traineEAttributes.updateOne(
          { trainee_id: idToDelete },
          { trainee_id: null }
        );
        if (upDate) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    },
    async createNewTraineeApplicant(_: any, { input }: any, context: any) {
      const { lastName, firstName, email, cycle_id, attributes } = input;
      const userWithRole = await LoggedUserModel.findById(
        context.currentUser?._id
      ).populate("role");

      // Validate email
      const validateEmail = (email: string) => {
        return String(email)
          .toLowerCase()
          .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          );
      };

      if (!validateEmail(email)) {
        throw new Error(
          "This email is not valid. Please provide a valid email."
        );
      }

      const session = await mongoose.startSession();
      session.startTransaction();

      try {
        const cycle = await applicationCycle
          .findById(cycle_id)
          .session(session);
        if (!cycle) {
          throw new Error("Application cycle not found");
        }

        const existingTrainee = await TraineeApplicant.findOne({
          email,
        }).session(session);
        if (existingTrainee) {
          const existingApplication = existingTrainee.cycleApplied.find(
            (app: any) => app.cycle.toString() === cycle_id
          );
          if (existingApplication) {
            throw new Error(
              "You have already applied to this application cycle"
            );
          }

          existingTrainee.cycle_id = cycle_id;
          existingTrainee.cycleApplied.push({
            cycle: cycle_id,
          });
          await existingTrainee.save({ session });
          await session.commitTransaction();
          //populating traineeApplicant with cycle_id
          return await TraineeApplicant.findById(existingTrainee._id).populate(
            "cycle_id"
          );
        }

        const newTrainee = new TraineeApplicant({
          lastName,
          firstName,
          email,
          cycle_id,
          cycleApplied: [
            {
              cycle: cycle_id,
            },
          ],
        });
        // Create the corresponding traineEAttributes
        if (
          userWithRole &&
          ((userWithRole.role as any)?.roleName === "admin" ||
            (userWithRole.role as any)?.roleName === "superAdmin")
        ) {
          const newTraineeAttributes = new traineEAttributes({
            trainee_id: newTrainee._id,
            ...attributes,
          });
          await newTraineeAttributes.save({ session });
        }

        await newTrainee.save({ session });
        await session.commitTransaction();
        await publishNotification(
          `${firstName} ${lastName} has registered as a new Trainee.`,
          "new_Trainee_application"
        );
        const result = {
          ...newTrainee.toObject(),
          createdAt: newTrainee.createdAt.toLocaleString(),
        };

        //return populated traineeApplicant
        return await TraineeApplicant.findById(result._id).populate("cycle_id");
      } catch (error) {
        await session.abortTransaction();
        throw error;
      } finally {
        session.endSession();
      }
    },

    async acceptTrainee(_: any, { traineeId, cohortId }: any, ctx: Context) {
      try {
        if (!ctx.currentUser) {
          throw new AuthenticationError("You must be logged in");
        }
        const userWithRole = await LoggedUserModel.findById(
          ctx.currentUser._id
        ).populate("role");
        if (
          !userWithRole ||
          ((userWithRole.role as any)?.roleName !== "admin" &&
            (userWithRole.role as any)?.roleName !== "superAdmin")
        ) {
          throw new AuthenticationError("Not allowed to access.");
        }

        const trainee = await TraineeApplicant.findById(traineeId);
        if (!trainee) {
          throw new CustomGraphQLError("Trainee not found");
        }

        if (trainee.cohort) {
          throw new CustomGraphQLError("Trainee already belongs to a cohort");
        }

        const cohort = await cohortModels.findById(cohortId).populate('trainees');
        if (!cohort) {
          throw new CustomGraphQLError("Cohort not found");
        }

        trainee.applicationPhase = "Enrolled";
        trainee.status = "Assigned";
        trainee.cohort = cohortId;
        await trainee.save();

        if (!cohort.trainees) {
          cohort.trainees = [];
        }

        cohort.trainees.push(traineeId);
        await cohort.save();

        return { success: true, message: "Trainee accepted successfully" };
      } catch (error) {
        throw new CustomGraphQLError(`Failed to accept trainee: ${error}`);
      }
    },
  },
};
