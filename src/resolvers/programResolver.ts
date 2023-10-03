import { AuthenticationError } from "apollo-server-core";
import { LoggedUserModel } from "../models/AuthUser";
import { ProgramModel } from "../models/programModel";
import { CustomGraphQLError } from "../utils/customErrorHandler";

export const programResolvers = {
	Query: {
		getAll: async (_: any, { data }: any, context: any) => {
			try {
				const userWithRole = await LoggedUserModel.findById(
					context.currentUser?._id
				).populate("role");

				if (
					!userWithRole ||
					!['admin', 'superAdmin'].includes((userWithRole.role as any)?.roleName)
				  ) {
					throw new CustomGraphQLError("Only superAdmin can create a program.");
				}
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
		selectedPrograms: async (_: any, filter : any, context: any) => {
			try {
			  const userWithRole = await LoggedUserModel.findById(
				context.currentUser?._id
			  ).populate("role");
		  
			  if (
				!userWithRole ||
				!['admin', 'superAdmin'].includes((userWithRole.role as any)?.roleName)
			  ){
				throw new CustomGraphQLError("Only superAdmin can create a program.");
			  }
			  
			  const skip = (filter.page - 1) * filter.pageSize;
			  const data = await ProgramModel.find({...filter.filter}).skip(skip).limit(filter.pageSize);
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
				!['admin', 'superAdmin'].includes((userWithRole.role as any)?.roleName)
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
					!['admin', 'superAdmin'].includes((userWithRole.role as any)?.roleName)
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
	},
};
