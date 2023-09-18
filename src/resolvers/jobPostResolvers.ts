import { LoggedUserModel } from "../models/AuthUser";
import { jobModels } from "../models/jobModels";
import { CustomGraphQLError } from "../utils/customErrorHandler";

export const jobPostResolver = {
	Query: {
		getAllJobApplication: async (_: any, args: any, context: any) => {
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
				const formsData = await jobModels.find();
				if (formsData.length === 0) {
					throw new CustomGraphQLError("no jobpost found");
				}
				return formsData;
			} catch (error) {
				throw new CustomGraphQLError(`some thing went wrong ${error}`);
			}
		},
		getJobApplication: async (_: any, args: any, context: any) => {
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
				const forms: any = await jobModels.findOne({ _id: args.id });
				if (forms.length === 0) {
					throw new Error("no job post found");
				}
				return forms;
			} catch (error) {
				throw new CustomGraphQLError(`some thing went wrong ${error}`);
			}
		},
	},
	Mutation: {
		createJobApplication: async (_: any, args: any, context: any) => {
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
				const existingRecord = await jobModels.findOne({ link: args.link });

				if (existingRecord) {
					throw new CustomGraphQLError(
						`A record with LINK ${args.link} already exists.`
					);
				}

				const userInputs = await jobModels.create(args);
				return userInputs;
			} catch (error) {
				throw new CustomGraphQLError(`Something went wrong: ${error}`);
			}
		},
		deleteJobApplication: async (_: any, args: any, context: any) => {
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
				const deleteJobApplication = await jobModels.findByIdAndDelete(args.id);
				return deleteJobApplication;
			} catch (error) {
				throw new CustomGraphQLError(`Error deleting job application: ${error}`);
			}
		},
		updateJobApplication: async (_:any, args:any, context:any) => {
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
              const updateJobApplication = await jobModels.findByIdAndUpdate(
                args.id,
                args,  
                { new: true }
              );
              return updateJobApplication;
            } catch (error) {
              throw new CustomGraphQLError(`Something went wrong: ${error}`);
            }
          },

	},
};
