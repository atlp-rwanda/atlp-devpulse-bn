import newApplicationsModel from "../models/newApplications";
import { validateUserApplication } from "../validations/newApplication.validation";
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
    doYouHaveLaptop:string
}
type error=any
export const newApplicationResolver:any = {
    Mutation:{
        async createNewApplication(_parent:any,args:argsDetails){
            try {
                const traineeData = args
                const { error, value } = validateUserApplication.validate(traineeData);
                if (error) {
                    throw new Error(`Validation error please verify ${error}`);
                }
                const newApplicant = new newApplicationsModel(value)
                await newApplicant.save()
                return newApplicant
            } catch (error:any) {
                return error
            }
            
        }
    }
}