import { traineEAttributes } from "../models/traineeAttribute";

const filterTraineeResolver: any = {
  Query: {
    async filterTraineesDetails(_: any, { input }: any) {
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
        .populate("trainee_id")
        .skip(itemsToSkip)
        .limit(items);

      if (wordEntered && !filterAttribute) {
        const filterResult = allTraineeAttribute.filter((value: any) => {
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
        const filterAttributeResult = allTraineeAttribute.filter(
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

      // Return all attributes otherwise
      return allTraineeAttribute;
    },
  },
};

export default filterTraineeResolver;
