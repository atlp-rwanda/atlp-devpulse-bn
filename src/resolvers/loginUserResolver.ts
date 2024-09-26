import { AuthenticationError } from 'apollo-server';
import { LoggedUserModel } from '../models/AuthUser';
import { RoleModel } from '../models/roleModel';
import { PermissionModel } from '../models/permissionModel';
import { generateToken } from '../utils/generateToken';
import BcryptUtil from '../utils/bcrypt';
import { validateUserLogged } from '../validations/createUser.validation';
import { validateLogin } from '../validations/login.validations';
import { generateAutoGeneratedPassword } from '../utils/passwordAutoGenerate';
import { sendUserCredentials } from '../helpers/bulkyMails';
import { userModel } from '../models/user';

export const loggedUserResolvers: any = {
  Query: {
    async user_Logged(_: any, args: any, ctx: any) {
      if (!ctx.currentUser) {
        throw new AuthenticationError('You must be logged in');
      }
      const userWithRole = await LoggedUserModel.findById(
        ctx.currentUser._id,
      ).populate('role');

      if (
        !userWithRole ||
        (userWithRole.role as any)?.roleName !== 'superAdmin'
      ) {
        throw new AuthenticationError('Ony superAdmin can access  user.');
      }
      const id = args.ID;
      const upvalue = await LoggedUserModel.findById(id).populate('role');
      return upvalue;
    },
    async getUsers_Logged(_: any, args: any, ctx: any, amount: any) {
      const users = await LoggedUserModel.find()
        .sort({ createdAt: -1 })
        .limit(amount)
        .populate({
          path: 'role',
          populate: {
            path: 'permissions',
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
        },
      }: any,
      ctx: any,
    ) {
      const existingUser = await LoggedUserModel.findOne({ email });
      
      if (!process.env.JWT_SECRET) {
        throw new Error("Please ensure that the secret key is properly configured")
      }

      if (existingUser) {
        throw new Error('Email already exists. Please use a different email.');
      }
      const existingUserByPhone = await LoggedUserModel.findOne({ telephone });
      if (existingUserByPhone) {
        throw new Error(
          "Telephone number already exists. Please use a different number."
        );
      }
      const userWithRole = await LoggedUserModel.findById(
        ctx.currentUser?._id,
      ).populate('role');

      if (
        userWithRole &&
        (userWithRole.role as any)?.roleName === 'superAdmin'
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
          });
          const res: any = await createdUser.save();
          await sendUserCredentials(res.email, autoGeneratedPassword);
          return res;
        } catch (error: any) {
          if (error.message.includes('Token expired')) {
            return {
              error: 'Super admin token is expired. Please log in again.',
            };
          }
          throw new Error('Server error');
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
            `Validation failed, please check : ${error.details[0].message}`,
          );
        }

        const superAdminEmail = process.env.SUPER_ADMIN_EMAIL;
        const adminEmail = process.env.ADMIN_EMAIL;

        let superAdminRole = await RoleModel.findOne({
          roleName: 'superAdmin',
        });
        if (!superAdminRole) {
          superAdminRole = new RoleModel({
            roleName: 'superAdmin',
            description: 'Super Admin Role Description',
          });
          await superAdminRole.save();
        }

        let adminRole = await RoleModel.findOne({ roleName: 'admin' });
        if (!adminRole) {
          adminRole = new RoleModel({
            roleName: 'admin',
            description: 'Admin Role Description',
          });
          await adminRole.save();
        }

        let applicantRole = await RoleModel.findOne({ roleName: 'applicant' });
        if (!applicantRole) {
          applicantRole = new RoleModel({
            roleName: 'applicant',
            description: 'Applicant Role Description',
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

        const res: any = await createdUser.save(); // MongoDB saving
        const tokenData = {
          _id: res._id,
          firstname: res.firstname,
          email: res.email,
          role: res.role,
        };
        const token = generateToken(tokenData, { expiresIn: '1h' });

        const response = { user: res };

        res.token = token;
        return res;
      }
    },
    async deleteUser_Logged(_: any, { ID }: any, ctx: any) {
      if (!ctx.currentUser) {
        throw new AuthenticationError('You must be logged in');
      }
      const userWithRole = await LoggedUserModel.findById(
        ctx.currentUser._id,
      ).populate('role');

      if (
        !userWithRole ||
        (userWithRole.role as any)?.roleName !== 'superAdmin'
      ) {
        throw new AuthenticationError('Unauthorized to create to user.');
      }
      const wasDeleted = (await LoggedUserModel.deleteOne({ _id: ID }))
        .deletedCount;
      return wasDeleted; //1 if something was deleted, 0 if nothing deleted
    },

    async updateUser_Logged(
      _: any,
      { ID, editUserInput: { firstname, lastname } }: any,
      ctx: any,
    ) {
      if (!ctx.currentUser) {
        throw new AuthenticationError('You must be logged in');
      }
      const userWithRole = await LoggedUserModel.findById(
        ctx.currentUser._id,
      ).populate('role');
      if (
        !userWithRole ||
        (userWithRole.role as any)?.roleName !== 'superAdmin'
      ) {
        throw new AuthenticationError('Unauthorized to update  user.');
      }
      const wasEdited = (
        await LoggedUserModel.updateOne({ _id: ID }, { firstname, lastname })
      ).modifiedCount;
      return wasEdited; //1||true if something was Edited, 0||true if nothing Edited
    },

    // ...

    assignRoleToUser: async (
      _: any,
      { ID, roleID }: { ID: string; roleID: string },
      context: any,
    ) => {
      try {
        if (!context.currentUser) {
          throw new AuthenticationError('You must be logged in');
        }
        const userWithRole = await LoggedUserModel.findById(
          context.currentUser._id,
        ).populate('role');
        if (
          !userWithRole ||
          (userWithRole.role as any)?.roleName !== 'superAdmin'
        ) {
          throw new AuthenticationError('Unauthorized to assign role to user.');
        }

        const user = await LoggedUserModel.findById(ID);

        if (!user) {
          throw new Error('User not found');
        }

        if (!user.isActive) {
          throw new Error('Inactive users cannot be assigned roles.');
        }

        if (!user.isActive) {
          throw new Error('Inactive users cannot be assigned roles.');
        }

        const role = await RoleModel.findById(roleID);

        if (!role) {
          throw new Error('Role not found');
        }

        user.role = role._id;
        await user.save();
        await user.populate({
          path: 'role',
          populate: {
            path: 'permissions',
            model: PermissionModel,
          },
        });

        return user;
      } catch (error) {
        throw new Error('Error assigning role: ' + (error as Error).message);
      }
    },

    updateUserStatus: async (_: any, { ID }: any, ctx: any) => {
      if (!ctx.currentUser) {
        throw new AuthenticationError('You must be logged in');
      }
      const userWithRole = await LoggedUserModel.findById(
        ctx.currentUser._id,
      ).populate('role');

      if (
        !userWithRole ||
        (userWithRole.role as any)?.roleName !== 'superAdmin'
      ) {
        throw new AuthenticationError('Unauthorized to update user status.');
      }

      const user = await LoggedUserModel.findById(ID);

      if (!user) {
        throw new Error('User not found');
      }

      user.isActive = !user.isActive;
      await user.save();

      return user.isActive;
    },

    login: async (_: any, { email, password }: any) => {
      const user = await LoggedUserModel.findOne({ email });

      if (!user) {
        throw new Error('User not found!');
      }

      if (!user.isActive) {
        throw new Error('Account deactivated!');
      }

      const { error, value } = validateLogin.validate({
        email,
        password,
      });

      if (error) {
        throw new Error(
          `Validation failed, please check : ${error.details[0].message}`,
        );
      }

      //@ts-ignore
      const passwordMatch = BcryptUtil.compare(password, user.password);

      if (!passwordMatch) {
        throw new Error('Email or Password is invalid');
      }
      const role = await RoleModel.findOne({ _id: user.role });

      const payload = {
        userId: user._id,
        email: user.email,
        role: user.role,
        roleName: role?.roleName,
        firstname: user.firstname,
        picture: user.picture,
        source: 'dev-pulse',
      };
      //@ts-ignore
      const token = generateToken(payload, {
        expiresIn: '1h',
      });

      return { token };
    },
  },
};
