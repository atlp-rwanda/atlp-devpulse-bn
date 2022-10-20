import TraineeApplicant from "../models/traineeApplicant";
import { traineEAttributes } from "../models/traineeAttribute";
import { applicationCycle } from "../models/applicationCycle";

export const traineeApplicantResolver: any = {
  Query: {
    async allTrainees(_: any, { input }: any) {
      // define page
      const { page, itemsPerPage, All } = input;
      let pages;
      let items;

      if (page) {
        pages = page;
      } else {
        pages = 1;
      }
      if (All) {
        // count total items inside the collections
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
        // .populate("applicant_id")
        .skip(itemsToSkip)
        .limit(items);
      return allTrainee;
    },

    async getOneTrainee(_: any, { ID }: any) {
      const trainee = await TraineeApplicant.findById(ID);
      // console.log("trainee", trainee);
      if (!trainee)
        throw new Error("No trainee is found, pleade provide the correct ID");
      return trainee;
    },
  },

  Mutation: {
    async updateTraineeApplicant(parent: any, args: any, context: any) {
      const { ID, updateInput } = args;

      if (updateInput.cycle) {
        const Validcycles = await applicationCycle.findOne({
          name: updateInput.cycle,
        });

        if (!Validcycles) {
          throw new Error("The cycle you entered does not exist!");
        } else {
          const singleTraineeAttributes = await traineEAttributes.findOne({
            trainee_id: ID,
          });
          const id = singleTraineeAttributes?._id;
          await traineEAttributes.findByIdAndUpdate(id, {
            cycle: updateInput.cycle,
          });
        }
      }
      const updated = await TraineeApplicant.findByIdAndUpdate(
        ID,
        {
          firstname: updateInput.firstname,
          lastname: updateInput.lastname,
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
        console.log(upDate);
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
      const cycle = args.input.cycle;

      const Validcycles = await applicationCycle.findOne({ name: cycle });

      if (!Validcycles) {
        throw new Error("The cycle you entered does not exist!");
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
        cycle: cycle,
      });
      return traineeToCreate;
    },
  },
};
