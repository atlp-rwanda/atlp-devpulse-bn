import { ProgramModel } from "../models/programModel";

const filterProgramResolver: any = {
  Query: {
    async filterProgramsDetails(_: any, { input }: any) {
      const { page, itemsPerPage, All, wordEntered, filterAttribute } = input;
      let pages = page || 1;
      let items = All ? await ProgramModel.countDocuments({}) : (itemsPerPage || 10);

      const itemsToSkip = (pages - 1) * items;

      let query: any = {};

      if (wordEntered && filterAttribute) {
        const allowedAttributes = [
          'title', 'description', 'mainObjective', 'modeOfExecution', 'duration'
        ];

        if (allowedAttributes.includes(filterAttribute)) {
          query[filterAttribute] = { $regex: wordEntered, $options: 'i' };
        }
      }

      try {
        const allPrograms = await ProgramModel.find(query)
          .skip(itemsToSkip)
          .limit(items);

        return allPrograms;
      } catch (error) {
        console.error("Error filtering programs:", error);
        return [];
      }
    },

    async getAllProgramAttributescount() {
      const AllProgramAttributescount = await ProgramModel.countDocuments();
      return { total: AllProgramAttributescount };
    },
  },
};

export default filterProgramResolver;