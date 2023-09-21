import { AuthenticationError } from "apollo-server-core"; 
import { LoggedUserModel } from "../models/AuthUser";
import { ProgramModel } from "../models/programModel";

export const programResolvers = {
  Query: {
    programs: async () => {
      return await ProgramModel.find();
    },
  },
  Mutation: {
    createProgram: async (_: any, { programInput }: any, context: any) => {
      try {
        const userWithRole = await LoggedUserModel.findById(context.currentUser?._id).populate('role');

        if (!userWithRole || (userWithRole.role as any)?.roleName !== 'superAdmin') {
          throw new AuthenticationError('Only superAdmin can create a program.');
        }

        const programData = {
          ...programInput,
          createdAt: new Date().toISOString(),
        };

        // Create a new program
        const program = new ProgramModel(programData);

        // Save the program to the database
        const savedProgram = await program.save();

        // Return the created program
        return savedProgram.toObject();
      } catch (error: any) {
        if (error.code === 11000 && error.keyPattern && error.keyPattern.title) {
          // Handle duplicate title error
          throw new Error('Program with the same title already exists.');
        }
        throw new Error('Failed to create program: ' + error.message);
      }
    },
  },
};
