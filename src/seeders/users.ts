import mongoose from "mongoose";
import { LoggedUserModel } from "../models/AuthUser";
import { RoleModel } from "../models/roleModel";
import BcryptUtil from "../utils/bcrypt";
import { cohortModels } from "../models/cohortModel";

// Seed users with superAdmin role.
const seedUsers = async() => {
        const superAdminRole = await RoleModel.findOne({ roleName: 'superAdmin' });
        const applicantRole = await RoleModel.findOne({ roleName: 'applicant' });
        const cohort = await cohortModels.findOne();

        if(!superAdminRole || !applicantRole || !cohort){
            return;
        }

        const users = [
            {
                firstname: "Super",
                lastname: "Admin",
                email: "admin@example.com",
                password: await BcryptUtil.hash("password123"),
                role: superAdminRole._id,
                country: "Rwanda",
                code: "+250",
                telephone: "0788888888",
                isActive: true,
                gender: "female",
                isVerified:true,

            },
            {
                firstname: "Manzi",
                lastname: "Jean",
                email: "jean@example.com",
                password: await BcryptUtil.hash("password123"),
                role: applicantRole._id,
                country: "Rwanda",
                code: "+250",
                telephone: "0788888889",
                isActive: true,
                gender: "male",
                applicationPhase: "Enrolled",
                cohort: cohort._id,
                isVerified:true,

            }
        ]
        await LoggedUserModel.deleteMany({users});
        await LoggedUserModel.insertMany(users);

}

export default seedUsers;