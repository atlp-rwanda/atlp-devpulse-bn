import { traineeAttributes } from "../models/traineeCollection";

export const traineeCollectionResolver: any = {
    Query: {
        async allTraineesCollection(_: any, { input }: any) {
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
                // count total items inside the collections
                const totalItems = await traineeAttributes.countDocuments({});
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
            const allTraineeCollection = await traineeAttributes.find({}).populate("trainee").skip(itemsToSkip).limit(items);
            return allTraineeCollection;
        },
    },

    Mutation: {
        async createTraineeCollection(_: any, { input }: any) {
            const traineeCollection = await traineeAttributes.create(input);
            return traineeCollection;
        },
    }
}
