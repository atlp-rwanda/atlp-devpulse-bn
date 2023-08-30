import { AuthenticationError } from 'apollo-server';
import { LoggedUserModel } from '../models/AuthUser';
import { PermissionModel } from '../models/permissionModel';

export const permissionResolvers = {
  Query: {
    permission: async (_: any, { id }: { id: string }, context:any) => {

      const userWithRole = await LoggedUserModel.findById(context.currentUser?._id).populate('role');

      if (!userWithRole || (userWithRole.role as any)?.roleName !== 'superAdmin') {
        throw new AuthenticationError('Only superadmin can access single entity with its permissions.');
      }
      return await PermissionModel.findById(id)
    },
    permissions: async (_: any, __: any, context: any) => {
      const userWithRole = await LoggedUserModel.findById(context.currentUser?._id).populate('role');

      if (!userWithRole || (userWithRole.role as any)?.roleName !== 'superAdmin') {
        throw new AuthenticationError('Only superadmin can access all entities with its permission .');
      }
      return await PermissionModel.find()
    },
  },
  Mutation: {
    createPermissionEntity: async (_: any, { entity }: any, context: any) => {
      const userWithRole = await LoggedUserModel.findById(context.currentUser?._id).populate('role');

      if (!userWithRole || (userWithRole.role as any)?.roleName !== 'superAdmin') {
        throw new AuthenticationError('Only superadmin can create entity.');
      }

      const newPermission = new PermissionModel({ entity });
      await newPermission.save();
      return newPermission;
    },
    
    updatePermissionField: async (_: any, { input }: any, context: any) => {
      const { entity, permissionField } = input;
  
      const userWithRole = await LoggedUserModel.findById(context.currentUser?._id).populate('role');
  
      if (!userWithRole || (userWithRole.role as any)?.roleName !== 'superAdmin') {
        throw new AuthenticationError('Only superadmin can update permissions.');
      }
  
      const currentPermission = await PermissionModel.findOne({ entity });
  
      if (!currentPermission) {
        throw new Error(`Permission for entity '${entity}' not found`);
      }
  
      const typedCurrentPermission: any = currentPermission.toObject();
  
      if (typeof typedCurrentPermission[permissionField] !== 'undefined') {
        typedCurrentPermission[permissionField].isPermitted = !typedCurrentPermission[permissionField].isPermitted;
      } else {
        throw new Error(`Permission field '${permissionField}' not found`);
      }
  
      await PermissionModel.updateOne({ _id: typedCurrentPermission._id }, typedCurrentPermission);
  
      return typedCurrentPermission;
    },

    async deletePermission(_: any, { ID }: any, ctx:any) {
      if (!ctx.currentUser) {
        throw new AuthenticationError('You must be logged in');
      }
      const userWithRole = await LoggedUserModel.findById(ctx.currentUser._id).populate('role');

      if (!userWithRole || (userWithRole.role as any)?.roleName !== 'superAdmin') {
        throw new AuthenticationError('Unauthorized to delete permission.');
      }
      const wasDeleted = (await PermissionModel.deleteOne({ id: ID! }))
        .deletedCount;
      return wasDeleted; //1 if something was deleted, 0 if nothing deleted
    },
    
  }
};
