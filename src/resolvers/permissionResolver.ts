import { AuthenticationError } from 'apollo-server';
import { LoggedUserModel } from '../models/AuthUser.js';
import { PermissionModel } from '../models/permissionModel.js';

export const permissionResolvers = {
  Query: {
    getPermission: async (_: any, { id }: { id: string }, context: any) => {

      if (!context.currentUser) {
        throw new AuthenticationError('User not authenticated.');
      }

      const userWithRole = await LoggedUserModel.findById(context.currentUser?._id).populate('role');

      if (!userWithRole || (userWithRole.role as any)?.roleName !== 'superAdmin') {
        throw new AuthenticationError('Only superadmin can access single entity with its permissions.');
      }
      
      return await PermissionModel.findById(id);
    },

    getAllPermissions: async (_: any, __: any, context: any) => {

      if (!context.currentUser) {
        throw new AuthenticationError('User not authenticated.');
      }

      const userWithRole = await LoggedUserModel.findById(context.currentUser?._id).populate('role');

      if (!userWithRole || (userWithRole.role as any)?.roleName !== 'superAdmin') {
        throw new AuthenticationError('Only superadmin can access all entities with its permission.');
      }
      return await PermissionModel.find();
    },
  },
  Mutation: {
    async deletePermission(_: any, { ID }: any, ctx: any) {

      if (!ctx.currentUser) {
        throw new AuthenticationError('You must be logged in');
      }

      const userWithRole = await LoggedUserModel.findById(ctx.currentUser._id).populate('role');

     
      if (!userWithRole || (userWithRole.role as any)?.roleName !== 'superAdmin') {
        throw new AuthenticationError('Unauthorized to delete permission.');
      }

      const wasDeleted = (await PermissionModel.deleteOne({ id: ID! })).deletedCount;
      
      return wasDeleted;
    },
  },
};
