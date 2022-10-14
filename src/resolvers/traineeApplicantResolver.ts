import TraineeApplicant from "../models/traineeApplicant";
import { traineEAttributes } from "../models/traineeAttribute";

export const traineeApplicantResolver: any = {
  Query: {
    async allTrainees(_: any, { input }: any) {
      const { page, itemsPerPage, All } = input;
      let pages;
      let items;

      if (page) {
        pages = page;
      } else {
        pages = 1;
      }
      if (All) {
        const totalItems = await TraineeApplicant.countDocuments({});
        items = totalItems;
      } else {
        if (itemsPerPage) {
          items = itemsPerPage;
        } else {
          items = 3;
        }
      }
      // define items per page
      const itemsToSkip = (pages - 1) * items;
      const allTrainee = await TraineeApplicant.find({})
        .skip(itemsToSkip)
        .limit(items);
      return allTrainee;
    },
    async oneTraineeApplicant(parent: any, args: any) {
      const getOnetrainee = await TraineeApplicant.findById(args.id);
      if (!getOnetrainee) throw new Error("trainee doesn't exist");
      return getOnetrainee;
    },
  },

  Mutation: {
    async updateTraineeApplicant(parent: any, args: any, context: any) {
      const { input, id } = args;
      const updated = await TraineeApplicant.findByIdAndUpdate(
        id,
        {
          email: input.email,
          firstName: input.firstName,
          lastName: input.lastName,
          deleted_at:input.deleted_at ? input.delete_at : false
        },
        { new: true }
      );
      return updated;
    },
    async deleteTraineeApplicant(parent: any, args: any, context: any) {
      const emailInput = args.email;
      const oneTraineeApplicant = await TraineeApplicant.findOne({
        email: emailInput,
      }).exec();
      const idToDelete = oneTraineeApplicant?._id;
      const trainee = await TraineeApplicant.deleteOne({ email: emailInput });
      console.log(trainee);
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
      return traineeToCreate;
    },
  },
};
