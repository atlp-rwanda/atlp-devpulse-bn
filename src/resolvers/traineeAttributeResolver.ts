import { traineEAttributes } from "../models/traineeAttribute";
import TraineeApplicant from "../models/traineeApplicant";

export const traineeAttributeResolver: any = {
  Query: {
    async allTraineesDetails(_: any, { input }: any) {
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
        // count total items inside the Attributes
        const totalItems = await traineEAttributes.countDocuments({});
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
      const allTraineeAttribute = await traineEAttributes
        .find({})
        .populate({
          path: "trainee_id",
          populate: {
            path: "cycle_id",
            model: "applicationCycle",
          },
        })
        .skip(itemsToSkip)
        .limit(items);
      return allTraineeAttribute;
    },

    async getOneTraineeAllDetails(_: any, { input }: any) {
      const { id } = input;
      const oneTraineeAttribute = await traineEAttributes
        .findOne({ trainee_id: id })
        .populate({
          path: "trainee_id",
          populate: {
            path: "cycle_id",
            model: "applicationCycle",
          },
        })
        .exec();
      return oneTraineeAttribute;
    },
  },

  Mutation: {
    async createTraineeAttribute(_: any, args: any) {
      const { attributeInput } = args;
      const search_id = attributeInput.trainee_id;
      const searchAttribute = await traineEAttributes
        .findOne({ trainee_id: search_id })
        .populate("trainee_id")
        .exec();
      const traineeAvailable = await TraineeApplicant.findOne({
        _id: search_id,
      });
      if (searchAttribute)
        throw new Error("Attribute cannot be created multiple times");
      else if (!traineeAvailable)
        throw new Error("Trainee with that Id is not found");
      else {
        if (attributeInput.birth_date) {
          attributeInput.birth_date = new Date(attributeInput.birth_date);
        }
    
      
        const booleanFields = ['isEmployed', 'haveLaptop', 'isStudent', 'understandTraining'];
        booleanFields.forEach(field => {
          if (attributeInput[field] !== undefined) {
            attributeInput[field] = attributeInput[field] === 'true' || attributeInput[field] === true;
          }
        });
    
        
        const traineeAttribute = await traineEAttributes.create(attributeInput);
        return traineeAttribute;
      }
    },

    async updateTraineeAttribute(parent: any, args: any, context: any) {
      const { ID, attributeUpdateInput } = args;

      
      if (attributeUpdateInput.birth_date) {
        attributeUpdateInput.birth_date = new Date(attributeUpdateInput.birth_date);
      }

      const updated = await traineEAttributes.findOneAndUpdate(
        { trainee_id: ID },
        {
          gender: attributeUpdateInput.gender,
          birth_date: attributeUpdateInput.birth_date,
          Address: attributeUpdateInput.Address,
          phone: attributeUpdateInput.phone,
          field_of_study: attributeUpdateInput.field_of_study,
          education_level: attributeUpdateInput.education_level,
          currentEducationLevel: attributeUpdateInput.currentEducationLevel,
          province: attributeUpdateInput.province,
          district: attributeUpdateInput.district,
          sector: attributeUpdateInput.sector,
          isEmployed: attributeUpdateInput.isEmployed,
          haveLaptop: attributeUpdateInput.haveLaptop,
          isStudent: attributeUpdateInput.isStudent,
          Hackerrank_score: attributeUpdateInput.Hackerrank_score,
          english_score: attributeUpdateInput.english_score,
          interview_decision: attributeUpdateInput.interview_decision,
          past_andela_programs: attributeUpdateInput.past_andela_programs,
          applicationPost: attributeUpdateInput.applicationPost,
          otherApplication: attributeUpdateInput.otherApplication,
          andelaPrograms: attributeUpdateInput.andelaPrograms,
          otherPrograms: attributeUpdateInput.otherPrograms,
          understandTraining: attributeUpdateInput.understandTraining,
          discipline: attributeUpdateInput.discipline,
        },
        { new: true }
      );
      if (!updated)
        throw new Error(
          "No Trainee is found, please provide the correct trainee_id"
        );
      return updated;
    },
  },
};