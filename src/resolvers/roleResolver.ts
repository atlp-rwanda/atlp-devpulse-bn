import { AuthenticationError } from "apollo-server";
import { RoleModel } from "../models/roleModel";
import { PermissionModel } from "../models/permissionModel";
import { publishNotification } from "./Adminnotification";

export const roleResolvers = {
  Query: {
    getRole: async (_: any, { id }: any, context: any) => {
      if (!context.currentUser) {
        throw new AuthenticationError("User not authenticated.");
      }

      const userWithRole = await RoleModel.findOne({
        _id: context.currentUser.role,
      });

      if (!userWithRole || userWithRole.roleName !== "superAdmin") {
        throw new AuthenticationError(
          "Only superadmin can access role details."
        );
      }

      return await RoleModel.findById(id).populate("permissions");
    },
    getAllRoles: async (_: any, __: any, context: any) => {
      if (!context.currentUser) {
        throw new AuthenticationError("User not authenticated.");
      }

      const userWithRole = await RoleModel.findOne({
        _id: context.currentUser.role,
      });

      if (!userWithRole || userWithRole.roleName !== "superAdmin") {
        throw new AuthenticationError("Only superadmin can access roles list.");
      }

      return await RoleModel.find().populate("permissions");
    },
  },
  Mutation: {
    createRole: async (_: any, { input }: any, context: any) => {
      if (!context.currentUser) {
        throw new AuthenticationError("User not authenticated.");
      }

      const userWithRole = await RoleModel.findOne({
        _id: context.currentUser.role,
      });

      if (!userWithRole || userWithRole.roleName !== "superAdmin") {
        throw new AuthenticationError("Only superadmin can create roles.");
      }

      const { roleName, description, permissions } = input;

      let existingRole = await RoleModel.findOne({ roleName });

      if (!existingRole) {
        existingRole = await RoleModel.create({
          roleName,
          description,
        });
      }

      for (const permissionInput of permissions) {
        const { entity, permissions: permissionFields } = permissionInput;

        let existingPermission = await PermissionModel.findOne({ entity });

        if (!existingPermission) {
          existingPermission = await PermissionModel.create({
            entity,
          });
        }

        if (existingPermission) {
          for (const field of permissionFields) {
            if (typeof (existingPermission as any)[field] === "boolean") {
              (existingPermission as any)[field] = !(existingPermission as any)[
                field
              ];
            }
          }
          await existingPermission.save();

          if (
            !existingRole.permissions.some(
              (permissionId) =>
                permissionId &&
                existingPermission &&
                permissionId.toString() === existingPermission._id.toString()
            )
          ) {
            existingRole.permissions.push(existingPermission._id);
          }
        }
      }

      const newRole = await existingRole.save();
      await publishNotification(
        `Role ${newRole.roleName} has been created successfully`,
        "Role Created"
      );
      const populatedRole = await RoleModel.populate(
        existingRole,
        "permissions"
      );

      return populatedRole;
    },

    updateRole: async (_: any, { id, input }: any, context: any) => {
      if (!context.currentUser) {
        throw new AuthenticationError("User not authenticated.");
      }

      const userWithRole = await RoleModel.findOne({
        _id: context.currentUser.role,
      });

      if (!userWithRole || userWithRole.roleName !== "superAdmin") {
        throw new AuthenticationError("Only superadmin can update roles.");
      }

      const { roleName, description, permissions } = input;

      const existingRole = await RoleModel.findById(id);

      if (!existingRole) {
        throw new Error("Role not found");
      }

      if (roleName) {
        existingRole.roleName = roleName;
      }
      if (description) {
        existingRole.description = description;
      }

      if (permissions && permissions.length > 0) {
        existingRole.permissions = [];

        for (const permissionInput of permissions) {
          const { entity, permissions: permissionFields } = permissionInput;

          let existingPermission = await PermissionModel.findOne({ entity });

          if (!existingPermission) {
            existingPermission = await PermissionModel.create({
              entity,
            });
          }

          if (existingPermission) {
            for (const field of permissionFields) {
              if (typeof (existingPermission as any)[field] === "boolean") {
                (existingPermission as any)[field] = !(
                  existingPermission as any
                )[field];
              }
            }
            await existingPermission.save();

            existingRole.permissions.push(existingPermission._id);
          }
        }
      }

      const updatedRole = await existingRole.save();
      await publishNotification(
        `Role ${updatedRole.roleName} has been Updated successfully`,
        "Role Updated"
      );
      const populatedRole = await RoleModel.populate(
        updatedRole,
        "permissions"
      );

      return populatedRole;
    },

    deleteRole: async (_: any, { id }: any, context: any) => {
      if (!context.currentUser) {
        throw new AuthenticationError("User not authenticated.");
      }

      const userWithRole = await RoleModel.findOne({
        _id: context.currentUser.role,
      });

      if (!userWithRole || userWithRole.roleName !== "superAdmin") {
        throw new AuthenticationError("Only superadmin can delete roles.");
      }

      const result = await RoleModel.findByIdAndDelete(id);

      if (!result) {
        throw new Error("Role not found.");
      }

      return true;
    },
  },
};
