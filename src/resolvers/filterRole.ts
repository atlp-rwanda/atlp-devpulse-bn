import { RoleModel } from "../models/roleModel";

const filterRoleResolver: any = {
  Query: {
    async filterRoleDetails(_: any, { input }: any) {
      const { page, itemsPerPage, All, wordEntered, filterAttribute } = input;
      let pages = page || 1;
      let items = All ? await RoleModel.countDocuments({}) : (itemsPerPage || 10);

      const itemsToSkip = (pages - 1) * items;

      let query: any = {};

      if (wordEntered && filterAttribute) {
        const allowedAttributes = [
          'roleName', 'description'
        ];

        if (allowedAttributes.includes(filterAttribute)) {
          query[filterAttribute] = { $regex: wordEntered, $options: 'i' };
        }
      }

      try {
        const allRoles = await RoleModel.find(query)
          .skip(itemsToSkip)
          .limit(items);

        return allRoles;
      } catch (error) {
        console.error("Error filtering programs:", error);
        return [];
      }
    },

    async getAllRoleAttributescount() {
      const AllRoleAttributescount = await RoleModel.countDocuments();
      return { total: AllRoleAttributescount };
    },
  },
};

export default filterRoleResolver;