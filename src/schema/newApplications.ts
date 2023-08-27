import { gql } from "apollo-server-core";

const typeDefs = gql`
  type ApplicantInfo {
    id: ID
    firstName: String
    lastName: String
    email: String
    dob: String
    currentlyStudying: Boolean
    educationLevel: String
    highestLevelOfEducation: String
    whatWasYourDiscipline: String
    nationality: String
    gender: String
    province: String
    district: String
    sector: String
    areYouEmployed: Boolean
    howDidYouFindThisApplication: String
    participateAndelaPrograms: String
    atlpUnPaid: Boolean
    doYouHaveLaptop: String
  }
  
  type Mutation {
    createNewApplication(
        firstName: String
    lastName: String
    email: String
    dob: String
    currentlyStudying: Boolean
    educationLevel: String
    highestLevelOfEducation: String
    whatWasYourDiscipline: String
    nationality: String
    gender: String
    province: String
    district: String
    sector: String
    areYouEmployed: Boolean
    howDidYouFindThisApplication: String
    participateAndelaPrograms: String
    atlpUnPaid: Boolean
    doYouHaveLaptop: String
    ): ApplicantInfo!
  }
  
  input NewApplicationInput {
    firstName: String
    lastName: String
    email: String
    dob: String
    currentlyStudying: Boolean
    educationLevel: String
    highestLevelOfEducation: String
    whatWasYourDiscipline: String
    nationality: String
    gender: String
    province: String
    district: String
    sector: String
    areYouEmployed: Boolean
    howDidYouFindThisApplication: String
    participateAndelaPrograms: String
    atlpUnPaid: Boolean
    doYouHaveLaptop: String
  }
`;

export default typeDefs;
