import { AuthenticationError } from 'apollo-server';
import mongoose, { model, Schema, Types } from 'mongoose';
import { RoleModel } from '../models/roleModel';
import { LoggedUserModel } from '../models/AuthUser';
import { PermissionModel } from '../models/permissionModel';

export const roleResolvers = {
  Query: {
    role: async (_: any, { id }: { id: string }, context:any) => {

      const userWithRole = await LoggedUserModel.findById(context.currentUser?._id).populate('role');

      if (!userWithRole || (userWithRole.role as any)?.roleName !== 'superAdmin') {
        throw new AuthenticationError('Only superadmin can access role details.');
      }
      return await RoleModel.findById(id).populate('permissions');
    },
    roles: async (_: any, __: any, context: any) => {
      const userWithRole = await LoggedUserModel.findById(context.currentUser?._id).populate('role');

      if (!userWithRole || (userWithRole.role as any)?.roleName !== 'superAdmin') {
        throw new AuthenticationError('Only superadmin can access roles list.');
      }
      return await RoleModel.find().populate('permissions');
    },
  },
  Mutation: {
    createRole: async (_: any, { input }: { input: any }, context: any) => {
      // console.log(context.currentUser, context.currentUser.role);
      if (!context.currentUser) {
        throw new AuthenticationError('User not authenticated.');
      }
  
      const userWithRole = await LoggedUserModel.findById(context.currentUser._id).populate('role');
  
      if (!userWithRole || (userWithRole.role as any)?.roleName !== 'superAdmin') {
        throw new AuthenticationError('Only superadmin can create roles.');
      }
  
      const { roleName, description } = input;
      const newRole = await RoleModel.create({
        roleName,
        description,
      });
  
      return newRole;
    },
    updateRole: async (_: any, { input }: { input: any }, context: any) => {
      const { _id, roleName, description } = input;

      const userWithRole = await LoggedUserModel.findById(context.currentUser._id).populate('role');

      if (!userWithRole || (userWithRole.role as any)?.roleName !== 'superAdmin') {
        throw new AuthenticationError('Only superadmin can update roles.');
      }

      if (!_id) {
        throw new Error('Role ID is required for updating.');
      }

      const updatedRole = await RoleModel.findByIdAndUpdate(_id, {
        roleName,
        description,
      }, { new: true });

      return updatedRole;
    },
    deleteRole: async (_:any, { id }: { id: string }, context: any) => {
      const userWithRole = await LoggedUserModel.findById(context.currentUser._id).populate('role');

      if (!userWithRole || (userWithRole.role as any)?.roleName !== 'superAdmin') {
        throw new AuthenticationError('Only superadmin can delete roles.');
      }

      const result = await RoleModel.findByIdAndDelete(id);

      if (!result) {
        throw new Error('Role not found.');
      }

      return true;
    },

    assignPermissionsToRole: async (_:any, { roleId, permissionIds }:any, context:any) => {
      const userWithRole = await LoggedUserModel.findById(
        context.currentUser?._id
      ).populate('role');

      if (
        !userWithRole ||
        (userWithRole.role as any)?.roleName !== 'superAdmin'
      ) {
        throw new AuthenticationError('Only superadmin can assign permissions.');
      }

      const role = await RoleModel.findById(roleId);
      if (!role) {
        throw new Error('Role not found.');
      }

      const permissions = await PermissionModel.find({ _id: { $in: permissionIds } });
      if (permissions.length !== permissionIds.length) {
        throw new Error('One or more permissions not found.');
      }
      //@ts-ignore
      role.permissions = permissions.map(permission => permission._id) as Types.ObjectId[];
      await role.save();
      await role.populate('permissions');
      return role;
    },
  },
};
