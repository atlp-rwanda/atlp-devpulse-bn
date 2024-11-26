import mongoose from "mongoose";
import { LoggedUserModel } from "../models/AuthUser";
import { RoleModel } from "../models/roleModel";
import BcryptUtil from "../utils/bcrypt";
import { cohortModels } from "../models/cohortModel";

// Seed users with superAdmin role.
const seedUsers = async () => {
  const superAdminRole = await RoleModel.findOne({ roleName: "superAdmin" });
  const applicantRole = await RoleModel.findOne({ roleName: "applicant" });
  let traineeRole = await RoleModel.findOne({ roleName: "trainee" });

  if (!traineeRole) {
    traineeRole = await RoleModel.create({
      roleName: "trainee",
      description: "A user who has been accepted as a trainee",
      permissions: [],
    });
  }
  const cohort = await cohortModels.findOne();

  if (!superAdminRole || !applicantRole || !traineeRole || !cohort) {
    return;
  }

  const users = [
    {
      firstname: "John",
      lastname: "Trainee",
      email: "trainee@example.com",
      password: await BcryptUtil.hash("password123"),
      role: traineeRole._id,
      country: "Rwanda",
      code: "+250",
      telephone: "0788888887",
      isActive: true,
      gender: "male",
      cohort: cohort._id,
      applicationPhase: "Admitted",
      isVerified: true,
    },
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
      isVerified: true,
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
      applicationPhase: "Applied",
      cohort: cohort._id,
      isVerified: true,
    },
    {
      firstname: "Jane",
      lastname: "Doe",
      email: "jane@example.com",
      password: await BcryptUtil.hash("password123"),
      role: applicantRole._id,
      country: "Rwanda",
      code: "+250",
      telephone: "0788888888",
      isActive: true,
      isVerified: true,
      gender: "male",
    },
  ];
  await LoggedUserModel.deleteMany({ users });
  await LoggedUserModel.insertMany(users);
};

export default seedUsers;
