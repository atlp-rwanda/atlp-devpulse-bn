import { AuthenticationError } from 'apollo-server';
import { LoggedUserModel } from '../models/AuthUser';
import { RoleModel } from '../models/roleModel';
import { PermissionModel } from '../models/permissionModel';
import { generateToken, verifyToken } from '../utils/generateToken';
import BcryptUtil from '../utils/bcrypt';
import { validateUserLogged } from '../validations/createUser.validation';
import { validateLogin } from '../validations/login.validations';
import { generateAutoGeneratedPassword } from '../utils/passwordAutoGenerate';
import { sendEmailTemplate, sendUserCredentials } from '../helpers/bulkyMails';
import { userModel } from '../models/user';
import { sessionModel } from '../models/session';
import { cohortModels } from '../models/cohortModel';
import TraineeApplicant from '../models/traineeApplicant';

const FrontendUrl = process.env.FRONTEND_URL

export const loggedUserResolvers: any = {
  Query: {
    async user_Logged(_: any, args: any, ctx: any) {
      if (!ctx.currentUser) {
        throw new AuthenticationError("You must be logged in");
      }
      const userWithRole = await LoggedUserModel.findById(
        ctx.currentUser._id
      ).populate("role");

      if (
        !userWithRole ||
        (userWithRole.role as any)?.roleName !== "superAdmin"
      ) {
        throw new AuthenticationError("Ony superAdmin can access  user.");
      }
      const id = args.ID;
      const upvalue = await LoggedUserModel.findById(id).populate("role");
      return upvalue;
    },
    async getUsers_Logged(_: any, args: any, ctx: any, amount: any) {
      const users = await LoggedUserModel.find()
        .sort({ createdAt: -1 })
        .limit(amount)
        .populate({
          path: "role",
          populate: {
            path: "permissions",
            model: PermissionModel,
          },
        });
      return users;
    },
    checkUserRole: async (_: any, email: any) => {
      const user = await LoggedUserModel.findOne(email);
      const role = await RoleModel.findOne({ _id: user?.role });
      return role;
    },
  },
  Mutation: {
    async createUser_Logged(
      _: any,
      {
        userInput: {
          firstname,
          lastname,
          telephone,
          gender,
          country,
          email,
          code,
          password,
          role,
          applicationPhase,
        },
      }: any,
      ctx: any
    ) {

      if (!process.env.JWT_SECRET) {
        throw new Error(
          "Please ensure that the secret key is properly configured"
        );
      }
      const existingUser = await LoggedUserModel.findOne({ email });
      if (existingUser) {
        throw new Error("Email already exists. Please use a different email.");
      }
      const existingUserByPhone = await LoggedUserModel.findOne({ telephone });
      if (existingUserByPhone) {
        throw new Error(
          "Telephone number already exists. Please use a different number."
        );
      }
      const userWithRole = await LoggedUserModel.findById(
        ctx.currentUser?._id
      ).populate("role");

      if (
        userWithRole &&
        (userWithRole.role as any)?.roleName === "superAdmin"
      ) {
        try {
          const autoGeneratedPassword = generateAutoGeneratedPassword();
          const createdUser = new LoggedUserModel({
            firstname,
            lastname,
            email,
            password: await BcryptUtil.hash(autoGeneratedPassword),
            code,
            telephone,
            gender,
            country,
            role,
            applicationPhase: applicationPhase || "Applied",
          });
          const res: any = await createdUser.save();
          await sendEmailTemplate(res.email, "Account credentials",
            `Hello ${res.email.split('@')[0]}, `,
            `Your account credentials are below:  <br />
              Email: ${res.email} <br />
              Password: ${autoGeneratedPassword} <br />
              Click on the button below to login
              `,
            {
              text: "Login",
              url: FrontendUrl + "/login"
            }
          )
          return res;
        } catch (error: any) {
          if (error.message.includes("Token expired")) {
            return {
              error: "Super admin token is expired. Please log in again.",
            };
          }
          throw new Error("Server error");
        }
      } else {
        const { error, value } = validateUserLogged.validate({
          firstname,
          lastname,
          telephone,
          gender,
          country,
          email,
          code,
          password,
        });
        if (error) {
          throw new Error(
            `Validation failed, please check : ${error.details[0].message}`
          );
        }

        const superAdminEmail = process.env.SUPER_ADMIN_EMAIL;
        const adminEmail = process.env.ADMIN_EMAIL;

        let superAdminRole = await RoleModel.findOne({
          roleName: "superAdmin",
        });
        if (!superAdminRole) {
          superAdminRole = new RoleModel({
            roleName: "superAdmin",
            description: "Super Admin Role Description",
          });
          await superAdminRole.save();
        }

        let adminRole = await RoleModel.findOne({ roleName: "admin" });
        if (!adminRole) {
          adminRole = new RoleModel({
            roleName: "admin",
            description: "Admin Role Description",
          });
          await adminRole.save();
        }

        let applicantRole = await RoleModel.findOne({ roleName: "applicant" });
        if (!applicantRole) {
          applicantRole = new RoleModel({
            roleName: "applicant",
            description: "Applicant Role Description",
          });
          await applicantRole.save();
        }

        const isSuperAdmin = email === superAdminEmail;
        const isAdmin = email === adminEmail;

        const role = isSuperAdmin
          ? superAdminRole
          : isAdmin
          ? adminRole
          : applicantRole;

        const createdUser = new LoggedUserModel({
          firstname,
          lastname,
          email,
          password: await BcryptUtil.hash(password),
          code,
          telephone,
          gender,
          country,
          role: role._id.toString(),
        });

        const res: any = await createdUser.save();
        const tokenData = {
          _id: res._id,
          firstname: res.firstname,
          email: res.email,
          role: res.role,
        };
        const token = generateToken(tokenData, { expiresIn: '1h' });
        const newSession = new sessionModel({
          userId: res._id,
          token
        });

        const savedSession = await newSession.save();
        await sendEmailTemplate(email, "Verify Account!",
          `Hello ${firstname || email.split('@')[0]},`,
          ` Welcome to Devpulse! We’re excited to have you join our community of
          developers, creators, and innovators.
          <br />
          <br/>
          Please verify your email in order to use the app.<br /><br />
          <br />
          Thank you for joining Devpulse – we can’t wait to see what you’ll create!
          <br />
          <br />
          Best regards,
          <br />
          The Devpulse Team`
          ,
          {
            text: "Verify Email",
            url: FrontendUrl + `/verifyEmail/?token=${token}`
          }
        );
        res.session = savedSession;

        const response = { user: res };
        res.token = token;
        return res;
      }
    },

    async resendVerifcationEmail(_: any, { userInput: { email } }: any, ctx: any) {
      const user = await LoggedUserModel.findOne({ email });
      if (!user) throw new Error("User with such email doesn't exist!");

      const tokenData = {
        _id: user._id,
        firstname: user.firstname,
        email: user.email,
        role: user.role
      };
      const token = generateToken(tokenData, { expiresIn: '1h' });

      const newSession = new sessionModel({
        userId: user._id,
        token
      });
      await newSession.save();
      await sendEmailTemplate(email, " Welcome to Devpulse – Your Account is Ready!",
        `Hello ${email.split('@')[0]},`,
        `
          Welcome to Devpulse! We’re excited to have you join our community of developers, creators, and innovators.
          <br/>
          <br/>
          Your account has been successfully created, and you’re all set to start exploring everything Devpulse has to offer. Whether you’re here to build projects, collaborate with others, or enhance your skills, we’re here to support your journey.
          <br/>
          <br/>
          <b>Here’s what you can do next:</b>
          <br/>
          <br/>
          Explore Your Dashboard: Get started by customizing your profile and exploring our features.
          Find Resources: Access tutorials, tools, and resources to accelerate your development.
          Collaborate with Peers: Connect with like-minded developers, share projects, and collaborate on innovative ideas.
          <br/>
          <br/>
          <b>Need Help?</b>
          <br/>
          <br/>
          If you have any questions or need assistance, our support team is here to help. Feel free to reach out to us at [support email] or visit our [Help Center](link to Help Center).
          <br/>
          <br/>
          <b>Stay Connected</b>
          <br/>
          <br/>
          Stay up to date with the latest news, updates, and community events by following us on our social media.
          <br/>
          <br/>
          Thank you for joining Devpulse – we can’t wait to see what you’ll create!
          <br/>
          <br/>
          Best regards,
          <br/>
          The Devpulse Team
          `
        ,
        {
          text: "Continue",
          url: FrontendUrl + '/#/verify-email/' + token
        }
      );
      return "Verification email sent successfully!";
    },
    async deleteUser_Logged(_: any, { ID }: any, ctx: any) {
      if (!ctx.currentUser) {
        throw new AuthenticationError("You must be logged in");
      }
      const userWithRole = await LoggedUserModel.findById(
        ctx.currentUser._id
      ).populate("role");

      if (
        !userWithRole ||
        (userWithRole.role as any)?.roleName !== "superAdmin"
      ) {
        throw new AuthenticationError("Unauthorized to create to user.");
      }
      const wasDeleted = (await LoggedUserModel.deleteOne({ _id: ID }))
        .deletedCount;
      return wasDeleted;
    },

    async updateUser_Logged(
      _: any,
      {
        ID,
        editUserInput: { firstname, lastname, applicationPhase, cohortId },
      }: any,
      ctx: any
    ) {
      if (!ctx.currentUser) {
        throw new AuthenticationError("You must be logged in");
      }
      const userWithRole = await LoggedUserModel.findById(
        ctx.currentUser._id
      ).populate("role");
      if (
        !userWithRole ||
        (userWithRole.role as any)?.roleName !== "superAdmin"
      ) {
        throw new AuthenticationError("Unauthorized to update  user.");
      }

      const updateData: any = { firstname, lastname };
      if (applicationPhase) {
        updateData.applicationPhase = applicationPhase;
      }

      if (applicationPhase && applicationPhase !== "Applied" && cohortId) {
        updateData.cohort = cohortId;
      }

      const user = await LoggedUserModel.findByIdAndUpdate(ID, updateData, {
        new: true,
      });

      if (user?.applicationPhase !== "Applied" && cohortId) {
        await cohortModels.findByIdAndUpdate(
          cohortId,
          { $addToSet: { trainees: ID } },
          { new: true }
        );
      }

      return !!user;

      // const wasEdited = (
      //   await LoggedUserModel.updateOne({ _id: ID }, { firstname, lastname })
      // ).modifiedCount;
      // return wasEdited; //1||true if something was Edited, 0||true if nothing Edited
    },


    assignRoleToUser: async (
      _: any,
      { ID, roleID }: { ID: string; roleID: string },
      context: any
    ) => {
      try {
        if (!context.currentUser) {
          throw new AuthenticationError("You must be logged in");
        }
        const userWithRole = await LoggedUserModel.findById(
          context.currentUser._id
        ).populate("role");
        if (
          !userWithRole ||
          (userWithRole.role as any)?.roleName !== "superAdmin"
        ) {
          throw new AuthenticationError("Unauthorized to assign role to user.");
        }

        const user = await LoggedUserModel.findById(ID);

        if (!user) {
          throw new Error("User not found");
        }

        if (!user.isActive) {
          throw new Error("Inactive users cannot be assigned roles.");
        }

        if (!user.isActive) {
          throw new Error("Inactive users cannot be assigned roles.");
        }

        const role = await RoleModel.findById(roleID);

        if (!role) {
          throw new Error("Role not found");
        }

        user.role = role._id;
        await user.save();
        await user.populate({
          path: "role",
          populate: {
            path: "permissions",
            model: PermissionModel,
          },
        });

        return user;
      } catch (error) {
        throw new Error("Error assigning role: " + (error as Error).message);
      }
    },

    updateUserStatus: async (_: any, { ID }: any, ctx: any) => {
      if (!ctx.currentUser) {
        throw new AuthenticationError("You must be logged in");
      }
      const userWithRole = await LoggedUserModel.findById(
        ctx.currentUser._id
      ).populate("role");

      if (
        !userWithRole ||
        (userWithRole.role as any)?.roleName !== "superAdmin"
      ) {
        throw new AuthenticationError("Unauthorized to update user status.");
      }

      const user = await LoggedUserModel.findById(ID);

      if (!user) {
        throw new Error("User not found");
      }

      user.isActive = !user.isActive;
      await user.save();

      return user.isActive;
    },

    login: async (_: any, { email, password }: any) => {
      const user = await LoggedUserModel.findOne({ email });

      if (user?.isVerified===false){
        throw new Error('User is not verified');
      }

      if (!user) {
        throw new Error("User not found!");
      }

      if (!user.isActive) {
        throw new Error("Account deactivated!");
      }

      const { error, value } = validateLogin.validate({
        email,
        password,
      });

      if (error) {
        throw new Error(
          `Validation failed, please check : ${error.details[0].message}`
        );
      }

      //@ts-ignore
      const passwordMatch = BcryptUtil.compare(password, user.password);

      if (!passwordMatch) {
        throw new Error("Email or Password is invalid");
      }
      const role = await RoleModel.findOne({ _id: user.role });

      const payload = {
        userId: user._id,
        email: user.email,
        role: user.role,
        roleName: role?.roleName,
        firstname: user.firstname,
        picture: user.picture,
        source: "dev-pulse",
      };
      //@ts-ignore
      const token = generateToken(payload, {
        expiresIn: "1h",
      });

      return { token };
    },

    async updateApplicationPhase(
      _: any,
      { userID, newPhase, cohortID }: any,
      ctx: any
    ) {
      if (!ctx.currentUser) {
        throw new AuthenticationError("You must be logged in");
      }
      const userWithRole = await LoggedUserModel.findById(
        ctx.currentUser._id
      ).populate("role");

      if (
        !userWithRole ||
        (userWithRole.role as any)?.roleName !== "superAdmin"
      ) {
        throw new AuthenticationError(
          "Unauthorized to update application phase."
        );
      }

      const updateData: any = { applicationPhase: newPhase };

      if (newPhase !== "Applied") {
        if (!cohortID) {
          throw new Error(
            "Cohort ID is required when changing phase from Applied"
          );
        }

        const cohort = await cohortModels.findById(cohortID);
        if (!cohort) {
          throw new Error("Cohort not found");
        }

        updateData.cohort = cohortID;
        updateData.applicationPhase = "Enrolled";
        updateData.status = "Assigned";

        const user = await LoggedUserModel.findById(userID);
        if (!user) {
          throw new Error("User not found");
        }

        const traineeApplicant = new TraineeApplicant({
          user: userID,
          email: user.email,
          firstName: user.firstname,
          lastName: user.lastname,
          cycle_id: cohort.cycle,
          applicationPhase: "Enrolled",
          status: "Assigned",
          cohort: cohortID,
        });

        await traineeApplicant.save();
      }
      const updatedUser = await LoggedUserModel.findByIdAndUpdate(
        userID,
        updateData,
        { new: true }
      ).populate("cohort");

      if (newPhase !== "Applied" && cohortID) {
        await cohortModels.findByIdAndUpdate(
          cohortID,
          { $addToSet: { trainees: userID } },
          { new: true }
        );
      }

      return updatedUser;
    }, 
    async verifyUser(_:any,{ID}:any){
      try{
        let user = await LoggedUserModel.findOne({_id:ID })as any;
        user.isVerified=true 
        await user?.save(); 
        return user
      }
      catch(error){
        throw new Error("Error occured please try again")
      }
    },
  },
};
