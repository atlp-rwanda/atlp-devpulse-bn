import TraineeApplicant from "../models/traineeApplicant";
import { traineEAttributes } from "../models/traineeAttribute";
import { applicationCycle } from "../models/applicationCycle";
import mongoose, { ObjectId } from "mongoose";
import { AuthenticationError } from 'apollo-server';

export const traineeApplicantResolver: any = {
  Query: {
    async allTrainees(_: any, { input }: any) {
      // define page
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
        // count total items inside the collections
        items = totalItems;
      } else {
        if (itemsPerPage && itemsPerPage > 0) {
          items = itemsPerPage;
        } else {
          items = 3;
        }
      }
      // define items per page
      const itemsToSkip = (pages - 1) * items;
      const allTrainee = await TraineeApplicant.find({delete_at:false})
        .populate("cycle_id")
        // .populate("applicant_id")
        .skip(itemsToSkip)
        .limit(items);

      const traineeApplicant = allTrainee;

      return {
        data: traineeApplicant,
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
  },

  Mutation: {
    async updateTraineeApplicant(parent: any, args: any, ctx: any) {
      if (!ctx.currentUser||ctx.currentUser.role !== 'admin') {
        throw new AuthenticationError('You are not authorized to perform this action');
      }
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
    async createNewTraineeApplicant(parent: any, args: any, context: any) {
      const newTrainee = args.input;
      const emailTest = args.input.email;

      const cycle = await applicationCycle.findById(args.input.cycle_id);
      if (!cycle) {
        throw new Error("the cycle provided does not exist");
      }
      const validateEmail = (email: any) => {
        return String(email)
          .toLowerCase()
          .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          );
      };
      if (validateEmail(emailTest) == null)
        throw new Error("This email is not valid please provide a valid email");

      const traineeToCreate = await TraineeApplicant.create(newTrainee);
      const trainee_id = traineeToCreate._id;

      const newTraineeAttribute = await traineEAttributes.create({
        trainee_id: trainee_id,
      });
      return traineeToCreate.populate("cycle_id");
    },
  },
};
