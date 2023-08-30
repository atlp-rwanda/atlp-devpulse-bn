import Joi from "joi";

interface UserApplicationInput {
  firstName: string;
  lastName: string;
  email: string;
  dob: string;
  currentlyStudying: boolean;
  educationLevel: string;
  highestLevelOfEducation: string;
  whatWasYourDiscipline: string;
  nationality: string;
  gender: string;
  province: string;
  district: string;
  sector: string;
  areYouEmployed: boolean;
  howDidYouFindThisApplication: string;
  participateAndelaPrograms: string;
  atlpUnPaid: boolean;
  doYouHaveLaptop: string;
  occupation:string;
  whichCompany:string;
}

export const validateUserApplication = Joi.object<UserApplicationInput>({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com","net"] },
    })
    .required(),
  dob: Joi.date().required(),
  currentlyStudying: Joi.boolean().required(),
  educationLevel: Joi.string(),
  highestLevelOfEducation: Joi.string().required(),
  whatWasYourDiscipline: Joi.string().required(),
  nationality: Joi.string().required(),
  gender: Joi.string().required(),
  province: Joi.string().required(),
  district: Joi.string().required(),
  sector: Joi.string().required(),
  areYouEmployed: Joi.boolean().required(),
  howDidYouFindThisApplication: Joi.string().required(),
  participateAndelaPrograms: Joi.string().required(),
  atlpUnPaid: Joi.boolean().required(),
  doYouHaveLaptop: Joi.boolean().required()
});
