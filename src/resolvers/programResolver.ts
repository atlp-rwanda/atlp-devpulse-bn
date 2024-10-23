import { AuthenticationError } from "apollo-server-core";
import { LoggedUserModel } from "../models/AuthUser";
import { ProgramModel } from "../models/programModel";
import { CustomGraphQLError } from "../utils/customErrorHandler";
import {
  validateProgram,
  validateUpdateProgram,
} from "../validations/program.validation";
import { publishNotification } from "./Adminnotification";
export const programResolvers = {
  Query: {
    getAll: async (_: any, { data }: any, context: any) => {
      try {
        const { page, pageSize } = data;
        const response = await ProgramModel.find()
          .skip((page - 1) * pageSize)
          .limit(pageSize);
        if (response.length == 0) {
          throw new CustomGraphQLError("Empty");
        }
        return response;
      } catch (error: any) {
        throw new CustomGraphQLError(error);
      }
    },
    selectedPrograms: async (_: any, filter: any, context: any) => {
      try {
        const userWithRole = await LoggedUserModel.findById(
          context.currentUser?._id
        ).populate("role");

        if (
          !userWithRole ||
          !["admin", "superAdmin"].includes(
            (userWithRole.role as any)?.roleName
          )
        ) {
          throw new CustomGraphQLError("Only superAdmin can get all programs.");
        }

        const skip = (filter.page - 1) * filter.pageSize;
        const data = await ProgramModel.find({ ...filter.filter })
          .skip(skip)
          .limit(filter.pageSize);
        return data;
      } catch (error) {
        throw new CustomGraphQLError(error);
      }
    },
    geSingleProgram: async (_: any, { id }: any, context: any) => {
      try {
        const userWithRole = await LoggedUserModel.findById(
          context.currentUser?._id
        ).populate("role");

        if (
          !userWithRole ||
          !["admin", "superAdmin"].includes(
            (userWithRole.role as any)?.roleName
          )
        ) {
          throw new CustomGraphQLError("Only superAdmin can view a program.");
        }

        const program = await ProgramModel.findById(id);
        return program;
      } catch (error) {
        throw new CustomGraphQLError(error);
      }
    },
  },
  Mutation: {
    createProgram: async (_: any, { programInput }: any, context: any) => {
      try {
        const userWithRole = await LoggedUserModel.findById(
          context.currentUser?._id
        ).populate("role");

        if (
          !userWithRole ||
          !["admin", "superAdmin"].includes(
            (userWithRole.role as any)?.roleName
          )
        ) {
          throw new AuthenticationError(
            "Only superAdmin can create a program."
          );
        }

        const programData = {
          ...programInput,
          createdAt: new Date().toISOString(),
        };

        // Create a new program
        const program = new ProgramModel(programData);

        // Save the program to the database
        const savedProgram = await program.save();
        await publishNotification(
          `${program.title} Program Created  , ${program.description}`,
          "New Program Created"
        );
        // Return the created program
        return savedProgram.toObject();
      } catch (error: any) {
        if (
          error.code === 11000 &&
          error.keyPattern &&
          error.keyPattern.title
        ) {
          // Handle duplicate title error
          throw new Error("Program with the same title already exists.");
        }
        throw new Error("Failed to create program: " + error.message);
      }
    },
    updateProgram: async (_: any, args: any, context: any) => {
      try {
        const userWithRole = await LoggedUserModel.findById(
          context.currentUser?._id
        ).populate("role");

        if (
          !userWithRole ||
          (userWithRole.role as any)?.roleName !== "superAdmin"
        ) {
          throw new CustomGraphQLError(
            "You do not have permission to perform this action"
          );
        }
        const { error, value } = validateUpdateProgram.validate(
          args.updateProgramInput
        );
        if (error) {
          throw new CustomGraphQLError(
            `Validation error , ${error.details[0].message}`
          );
        }
        const updatedProgram = await ProgramModel.findByIdAndUpdate(
          args.updateProgramInput._id,
          args.updateProgramInput,
          {
            new: true,
          }
        );
        await publishNotification(
          `${args.updateProgramInput.title} Program Updated , ${args.updateProgramInput.description}`,
          "Program Updated"
        );
        if (!updatedProgram) {
          throw new CustomGraphQLError("Program Not Found");
        }
        return updatedProgram;
      } catch (error: any) {
        throw new CustomGraphQLError(error.message);
      }
    },
    deleteProgram: async (_: any, args: any, context: any) => {
      const userWithRole = await LoggedUserModel.findById(
        context.currentUser?._id
      ).populate("role");
      if (
        !userWithRole ||
        ((userWithRole.role as any)?.roleName !== "managers" &&
          (userWithRole.role as any)?.roleName !== "superAdmin")
      ) {
        throw new CustomGraphQLError(
          "You do not have permission to perform this action"
        );
      }
      try {
        const programToDelete = await ProgramModel.findById(args._id);
        if (!programToDelete) {
          throw new CustomGraphQLError("Program Not Found");
        }
        await publishNotification(
          `${programToDelete.title} Program Deleted, ${programToDelete.description}`,
          "Program Deleted"
        );

        const deletedProgram = await ProgramModel.findByIdAndDelete(args._id);

        if (!deletedProgram) {
          throw new CustomGraphQLError("Program Not Found");
        }
        return deletedProgram;
      } catch (error) {
        throw new CustomGraphQLError(`Error deleting program: ${error}`);
      }
    },
  },
};
