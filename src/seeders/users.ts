import { LoggedUserModel } from "../models/AuthUser";
import { RoleModel } from "../models/roleModel";
import BcryptUtil from "../utils/bcrypt";

// Seed users with superAdmin role.
const seedUsers = async() => {
        const superAdminRole = await RoleModel.findOne({ roleName: 'superAdmin' });
        const applicantRole = await RoleModel.findOne({ roleName: 'applicant' });

        if(!superAdminRole || !applicantRole){
            console.error("Roles not found");
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

            }
        ]

        await LoggedUserModel.insertMany(users);

}

export default seedUsers;