import { jobModels } from "../models/jobModels";
import { ProgramModel } from "../models/programModel";
import  applicationCycle  from "../models/applicationCycle";
import { cohortModels } from "../models/cohortModel";

const filterJobResolver: any = {
  Query: {
    async filterJobDetails(_: any, { input }: any) {
      const { page, itemsPerPage, All, wordEntered, filterAttribute } = input;
      let pages = page || 1;
      let items = All ? await jobModels.countDocuments({}) : (itemsPerPage || 10);

      const itemsToSkip = (pages - 1) * items;

      let query: any = {};

      if (wordEntered && filterAttribute) {
        const allowedAttributes = [
          'title', 'description', 'label', 'link',
          'program.name', 'cycle.name', 'cohort.name'
        ];

        if (allowedAttributes.includes(filterAttribute)) {
          if (['program.name', 'cycle.name', 'cohort.name'].includes(filterAttribute)) {
            const [model, field] = filterAttribute.split('.');
            query[model] = { $ne: null };
            query[`${model}.${field}`] = { $regex: wordEntered, $options: 'i' };
          } else {
            query[filterAttribute] = { $regex: wordEntered, $options: 'i' };
          }
        }
      }

      try {
        const allJobApplications = await jobModels.find(query)
          .populate('program')
          .populate('cycle')
          .populate('cohort')
          .skip(itemsToSkip)
          .limit(items);

          if(allJobApplications===null){
            return "There was an error"
          }
        console.log(allJobApplications)
        return allJobApplications;
      } catch (error) {
        console.error("Error filtering job applications:", error);
        return [];
      }
    },

    async getAllJobAttributescount() {
      const AllJobAttributescount = await jobModels.countDocuments();
      return { total: AllJobAttributescount };
    },
  },
};

export default filterJobResolver;