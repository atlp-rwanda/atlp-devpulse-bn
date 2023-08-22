import { AuthenticationError } from "apollo-server";
import { LoggedUserModel } from "../models/AuthUser";
import { RoleModel } from "../models/roleModel";
import { PermissionModel } from "../models/permissionModel";

export const loggedUserResolvers: any = {
  Query: {
    async user_Logged(_: any, args: any, ctx: any) {
      const id = args.ID;
      const upvalue = await LoggedUserModel.findById(id).populate('role');
      return upvalue;
    },
    async getUsers_Logged(_: any, args: any, ctx: any, amount: any) {
      const users = await LoggedUserModel.find().sort({ createdAt: -1 }).limit(amount).populate({
        path: 'role',
        populate: {
          path: 'permissions',
          model: PermissionModel, 
        },
      });
      return users;
    },
  },
  Mutation: {
    async createUser_Logged(
      _: any,
      { userInput: { name, email, picture } }: any
    , ctx:any) {
      if (!ctx.currentUser) {
        throw new AuthenticationError('You must be logged in');
      }
      const userWithRole = await LoggedUserModel.findById(ctx.currentUser._id).populate('role');

      if (!userWithRole || (userWithRole.role as any)?.roleName !== 'superAdmin') {
        throw new AuthenticationError('Unauthorized to create  user.');
      }
      const createdUser = new LoggedUserModel({
        name,
        email,
        picture,
        createdAt: new Date().toISOString(),
      });

      const res = await createdUser.save(); // MongoDB saving
      return res;
    },
    async deleteUser_Logged(_: any, { ID }: any, ctx:any) {
      if (!ctx.currentUser) {
        throw new AuthenticationError('You must be logged in');
      }
      const userWithRole = await LoggedUserModel.findById(ctx.currentUser._id).populate('role');

      if (!userWithRole || (userWithRole.role as any)?.roleName !== 'superAdmin') {
        throw new AuthenticationError('Unauthorized to create to user.');
      }
      const wasDeleted = (await LoggedUserModel.deleteOne({ _id: ID }))
        .deletedCount;
      return wasDeleted; //1 if something was deleted, 0 if nothing deleted
    },

    async updateUser_Logged(_: any, { ID, editUserInput: { name } }: any, ctx:any) {
      if (!ctx.currentUser) {
        throw new AuthenticationError('You must be logged in');
      }
      const userWithRole = await LoggedUserModel.findById(ctx.currentUser._id).populate('role');
      if (!userWithRole || (userWithRole.role as any)?.roleName !== 'superAdmin') {
        throw new AuthenticationError('Unauthorized to update  user.');
      }
      const wasEdited = (await LoggedUserModel.updateOne({ _id: ID }, { name }))
        .modifiedCount;
      return wasEdited; //1||true if something was Edited, 0||true if nothing Edited
    },

   

    // ...
    
    assignRoleToUser: async (_: any, { ID, roleID }: { ID: string, roleID: string }, context: any) => {
      try {
        if (!context.currentUser) {
          throw new AuthenticationError('You must be logged in');
        }
        const userWithRole = await LoggedUserModel.findById(context.currentUser._id).populate('role');

        if (!userWithRole || (userWithRole.role as any)?.roleName !== 'superAdmin') {
          throw new AuthenticationError('Unauthorized to assign role to user.');
        }
        
        const user = await LoggedUserModel.findById(ID);

        if (!user) {
          throw new Error('User not found');
        }

        const role = await RoleModel.findById(roleID);

        if (!role) {
          throw new Error('Role not found');
        }

        user.role = role._id;
        await user.save();
        await user.populate('role');

        return user;
      } catch (error) {
        throw new Error('Error assigning role: ' + (error as Error).message);
      }
    },

    updateUserStatus: async (_: any, { ID }: any, ctx: any) => {
      if (!ctx.currentUser) {
        throw new AuthenticationError('You must be logged in');
      }
      const userWithRole = await LoggedUserModel.findById(ctx.currentUser._id).populate('role');
    
      if (!userWithRole || (userWithRole.role as any)?.roleName !== 'superAdmin') {
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
    
  },
};
