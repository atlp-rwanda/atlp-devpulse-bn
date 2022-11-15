import TraineeApplicant from "../models/traineeApplicant";

const traineeResolvers: any = {
  Query: {
    async getAllTrainees(parent: any, args: any) {
      const gettrainee = await TraineeApplicant.find({
        delete_at: false,
      }).populate("cycle_id");

      return gettrainee;
    },

    async getAllSoftDeletedTrainees(_: any, { input }: any) {

      // define page
      const { page, itemsPerPage, All, wordEntered, filterAttribute } = input;
      let pages;
      let items;
      let usedAttribute: any;
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

      const getAllSoftDeletedTrainee = await TraineeApplicant.find({
        delete_at: true,
      }).populate("cycle_id")
        .skip(itemsToSkip)
        .limit(items);

      // if (!getAllSoftDeletedTrainee) throw new Error("no Trainee Available");

      const nonNullTrainee = getAllSoftDeletedTrainee.filter((value) => {
        return value !== null;
      });


      if (wordEntered && !filterAttribute) {
        const filterResult = nonNullTrainee.filter((value: any) => {
          return (
            value._id
              .toString()
              .toLowerCase()
              .includes(wordEntered.toString().toLowerCase()) ||
            value.gender
              .toString()
              .toLowerCase()
              .includes(wordEntered.toString().toLowerCase()) ||
            value.birth_date
              .toString()
              .toLowerCase()
              .includes(wordEntered.toString().toLowerCase()) ||
            value.Address.toString()
              .toLowerCase()
              .includes(wordEntered.toString().toLowerCase()) ||
            value.phone
              .toString()
              .toLowerCase()
              .includes(wordEntered.toString().toLowerCase()) ||
            value.field_of_study
              .toString()
              .toLowerCase()
              .includes(wordEntered.toString().toLowerCase()) ||
            value.education_level
              .toString()
              .toLowerCase()
              .includes(wordEntered.toString().toLowerCase()) ||
            value.province
              .toString()
              .toLowerCase()
              .includes(wordEntered.toString().toLowerCase()) ||
            value.district
              .toString()
              .toLowerCase()
              .includes(wordEntered.toString().toLowerCase()) ||
            value.sector
              .toString()
              .toLowerCase()
              .includes(wordEntered.toString().toLowerCase()) ||
            value.isEmployed
              .toString()
              .toLowerCase()
              .includes(wordEntered.toString().toLowerCase()) ||
            value.haveLaptop
              .toString()
              .toLowerCase()
              .includes(wordEntered.toString().toLowerCase()) ||
            value.isStudent
              .toString()
              .toLowerCase()
              .includes(wordEntered.toString().toLowerCase()) ||
            value.Hackerrank_score.toString()
              .toLowerCase()
              .includes(wordEntered.toString().toLowerCase()) ||
            value.interview_decision
              .toString()
              .toLowerCase()
              .includes(wordEntered.toString().toLowerCase()) ||
            value.past_andela_programs
              .toString()
              .toLowerCase()
              .includes(wordEntered.toString().toLowerCase()) ||
            value.trainee_id._id
              .toString()
              .toLowerCase()
              .includes(wordEntered.toString().toLowerCase()) ||
            value.trainee_id.email
              .toString()
              .toLowerCase()
              .includes(wordEntered.toString().toLowerCase()) ||
            value.trainee_id.firstName
              .toString()
              .toLowerCase()
              .includes(wordEntered.toString().toLowerCase()) ||
            value.trainee_id.lastName
              .toString()
              .toLowerCase()
              .includes(wordEntered.toString().toLowerCase()) ||
            value.trainee_id.delete_at
              .toString()
              .toLowerCase()
              .includes(wordEntered.toString().toLowerCase())
          );
        });

        return filterResult;
      }

      if (wordEntered && filterAttribute) {
        const filterAttributeResult = getAllSoftDeletedTrainee.filter(
          (value: any) => {
            let arr = Object.keys(value.trainee_id.toJSON());
            let arr1 = Object.keys(value.toJSON());

            let allKeys: any = arr.concat(arr1);

            for (let i = 0; i < allKeys.length; i++) {
              if (allKeys[i].toLowerCase() == filterAttribute.toLowerCase()) {
                usedAttribute = allKeys[i];
              }
            }

            if (arr.includes(usedAttribute)) {
              return value.trainee_id[usedAttribute]
                .toString()
                .toLowerCase()
                .includes(wordEntered.toString().toLowerCase());
            } else if (arr1.includes(usedAttribute)) {
              return value[usedAttribute]
                .toString()
                .toLowerCase()
                .includes(wordEntered.toString().toLowerCase());
            } else {
              return [];
            }
          }
        );
        return filterAttributeResult;
      }














      return getAllSoftDeletedTrainee;
    },



    async traineeSchema(parent: any, args: any) {
      const getOnetrainee = await TraineeApplicant.findById(args.id).populate(
        "cycle_id"
      );
      if (!getOnetrainee) throw new Error("trainee doesn't exist");
      return getOnetrainee;
    },
  },
  Mutation: {
    async deleteTrainee(parent: any, args: any, context: any) {
      const deleteTrainee = await TraineeApplicant.findById(args.id).populate(
        "cycle_id"
      );
      if (!deleteTrainee) throw new Error(" Trainee doesn't exist");
      const deletedTrainee = await TraineeApplicant.findByIdAndRemove(
        args.id
      ).populate("cycle_id");

      return deletedTrainee;
    },
    async softdeleteTrainee(parent: any, args: any) {
      const trainee = await TraineeApplicant.findById(args.input.id).populate(
        "cycle_id"
      );
      if (!trainee) throw new Error("Trainee doesn't exist");
      const softDelete = await TraineeApplicant.findByIdAndUpdate(
        args.input.id,
        { $set: { delete_at: true, id: args.input.id } },
        { new: true }
      ).populate("cycle_id");
      return softDelete;
    },
    async softRecover(parent: any, args: any) {
      const trainee = await TraineeApplicant.findById(args.input.id).populate(
        "cycle_id"
      );
      if (!trainee) throw new Error("Trainee doesn't exist");
      const softRecovered = await TraineeApplicant.findByIdAndUpdate(
        args.input.id,
        { $set: { delete_at: false, id: args.input.id } },
        { new: true }
      ).populate("cycle_id");
      return softRecovered;
    },
  },
};
export default traineeResolvers;
