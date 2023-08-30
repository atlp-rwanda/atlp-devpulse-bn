import newApplicationsModel from "../models/newApplications";
import { validateUserApplication } from "../validations/newApplication.validation";
import { CustomGraphQLError } from "../validations/customeError";
type argsDetails = {
    firstName:string,
    lastName:string,
    email:string,
    dob:Date,
    currentlyStudying:Boolean,
    educationLevel:string,
    highestLevelOfEducation:string,
    whatWasYourDiscipline:string,
    Nationality:string,
    gender:string,
    province:string,
    district:string,
    sector:string,
    areYouEmployed:boolean,
    howDidYouFindThisApplication:string,
    participateAndelaPrograms:string,
    atlpUnPaid:boolean,
    doYouHaveLaptop:string,
    occupation:string
}
type error=any
export const newApplicationResolver: any = {
    Mutation: {
        async createNewApplication(_parent: any, args: argsDetails) {
            try {
                const traineeData = args;
                const { error, value } = validateUserApplication.validate(traineeData);
                if (error) {
                    throw new Error(`Validation error, please verify: ${error}`);
                }
                const twoMonthsAgo = new Date();
                twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);                
                const existingApplicant = await newApplicationsModel.findOne({
                    email: value.email,
                    createdAt: { $gte: twoMonthsAgo },
                });

                if (existingApplicant) {
                    throw new Error('You have already applied to this cohort.');
                }
                if (!value.currentlyStudying) {
                    value.educationLevel = 'false';
                }
                if (!value.areYouEmployed) {
                    value.occupation = 'None';
                    value.whichCompany = 'none'
                }
                const newApplicant = new newApplicationsModel(value);
                await newApplicant.save();
                return newApplicant;
            } catch (error: any) {
                throw new CustomGraphQLError(error.message);
            }
        },
    },
};