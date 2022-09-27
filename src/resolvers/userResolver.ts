import { TraineeApplicant } from "../models/traineeApplicant";
import { traineeAttributes } from "../models/traineeCollection";

export const resolvers: any = {
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
            // assumen pages = 4, items = , total datas = 14
            // define items per page
            const itemsToSkip = (pages - 1) * items;

            const allTraineeCollection = await traineeAttributes.find({}).populate("trainee").skip(itemsToSkip).limit(items);
            const allTraineeCollectionV1 = allTraineeCollection.map((traineeCol) => {
                return {
                    gender: traineeCol.gender,
                    birth_date: traineeCol.birth_date,
                    Address: traineeCol.Address,
                    phone: traineeCol.phone,
                    field_of_study: traineeCol.field_of_study,
                    education_level: traineeCol.education_level,
                    province: traineeCol.province,
                    district: traineeCol.district,
                    sector: traineeCol.sector,
                    cohort: traineeCol.cohort,
                    isEmployeed: traineeCol.isEmployeed,
                    haveLaptop: traineeCol.haveLaptop,
                    isStudent: traineeCol.isStudent,
                    Hackerrank_score: traineeCol.Hackerrank_score,
                    english_score: traineeCol.english_score,
                    interview_decision: traineeCol.interview_decision,
                    past_andela_programs: traineeCol.past_andela_programs,
                    _id: traineeCol._id,
                    trainee: traineeCol.trainee
                }
            })
            return allTraineeCollectionV1;
        },


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
            // assumen pages = 4, items = , total datas = 14
            // define items per page
            const itemsToSkip = (pages - 1) * items;

            const allTrainee = await TraineeApplicant.find({}).skip(itemsToSkip).limit(items);
            const allTraineeV1 = allTrainee.map((trainee) => {
                console.log(trainee);
                return {
                    email: trainee.email,
                    firstName: trainee.firstName,
                    lastName: trainee.lastName,
                    _id: trainee._id
                }
            })
            return allTraineeV1;
        }
    },
    Mutation: {
        async createTraineeApplicant(parent: any, args: any, context: any) {
            const { input } = args;
            console.log(input);
            const trainee = await TraineeApplicant.create(input)

            // traineeAttributes
            return {
                firstName: trainee.firstName,
                lastName: trainee.lastName,
                email: trainee.email,
                _id: trainee._id
            }
        },

        async createTraineeCollection(_: any, { input }: any) {
            const traineeCollection = await traineeAttributes.create(input)
            return {
                gender: traineeCollection.gender,
                birth_date: traineeCollection.birth_date,
                Address: traineeCollection.Address,
                phone: traineeCollection.phone,
                field_of_study: traineeCollection.field_of_study,
                education_level: traineeCollection.education_level,
                province: traineeCollection.province,
                district: traineeCollection.district,
                sector: traineeCollection.sector,
                cohort: traineeCollection.cohort,
                isEmployeed: traineeCollection.isEmployeed,
                haveLaptop: traineeCollection.haveLaptop,
                isStudent: traineeCollection.isStudent,
                Hackerrank_score: traineeCollection.Hackerrank_score,
                english_score: traineeCollection.english_score,
                interview_decision: traineeCollection.interview_decision,
                past_andela_programs: traineeCollection.past_andela_programs,
                _id: traineeCollection._id,
                trainee: traineeCollection.trainee
            }
        },
    }
}
