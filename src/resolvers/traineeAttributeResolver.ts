import { traineEAttributes }  from "../models/traineeAttribute";

export const traineeAttributeResolver: any = {
    Query: {
        async allTraineesAttribute(_: any, { input }: any) {
            // define page
            const { page, itemsPerPage, All } = input
            let pages;
            let items;
            if (page) {
                pages = page;
            }
            else {
                pages = 1
            }
            if (All) {
                // count total items inside the Attributes
                const totalItems = await traineEAttributes.countDocuments({});
                items = totalItems;
            }
            else {
                if (itemsPerPage) {
                    items = itemsPerPage;
                }
                else {
                    items = 3
                }
            }
            // define items per page
            const itemsToSkip = (pages - 1) * items;
            const allTraineeAttribute = await traineEAttributes.find({}).populate("trainee_id").skip(itemsToSkip).limit(items);
            return allTraineeAttribute;
        },
    },

    Mutation: {
        async createTraineeAttribute(_: any, { input }: any) {
            const traineeAttribute = await traineEAttributes.create(input);
            return traineeAttribute;
        },
    }
}
