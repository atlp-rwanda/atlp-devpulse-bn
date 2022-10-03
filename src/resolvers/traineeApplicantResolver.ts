import TraineeApplicant  from "../models/traineeApplicant";

export const traineeApplicantResolver: any = {
    Query: {
        async allTrainees(_: any, { input }: any) {
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
                const totalItems = await TraineeApplicant.countDocuments({});
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
            const allTrainee = await TraineeApplicant.find({}).skip(itemsToSkip).limit(items);
            return allTrainee;
        }
    },

    Mutation: {
        async updateTraineeApplicant(parent: any, args: any, context: any) {
            const { input } = args;
            const updated = await TraineeApplicant.findByIdAndUpdate(input.id, {
                email: input.email,
                firstName: input.firstName,
                lastName: input.lastName
            }, { new: true });
            return updated
        },

        async createTraineeApplicant(parent: any, args: any, context: any) {
            const { input } = args;
            const trainee = await TraineeApplicant.create(input)
            return trainee;
        },
    }
}
