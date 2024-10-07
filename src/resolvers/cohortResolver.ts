import { cohortModels } from "../models/cohortModel";
import { LoggedUserModel } from "../models/AuthUser";
import { CustomGraphQLError } from "../utils/customErrorHandler";

export const cohortResolver =  {
    Query: {
        getAllCohorts: async (_: any, args: any, context: any) => {
			try {
				const cohorts = await cohortModels.find();
				if (cohorts.length === 0) {
					throw new CustomGraphQLError("no jobpost found");
				}
				return cohorts;
			} catch (error) {
				throw new CustomGraphQLError(`some thing went wrong ${error}`);
			}
		},
        getCohort: async (_: any, args: any, context: any) => {
			try {
				const cohort = await cohortModels.findOne({ _id: args.id });
				if (!cohort) {
					throw new Error("no cohort found");
				}
				return cohort;
			} catch (error) {
				throw new CustomGraphQLError(`some thing went wrong ${error}`);
			}
		},
    },
    Mutation: {
		createCohort: async (_: any, args: any, context: any) => {
			const userWithRole = await LoggedUserModel.findById(
				context.currentUser?._id
			).populate("role");

			if (
				!userWithRole ||
				((userWithRole.role as any)?.roleName !== "admin" &&
					(userWithRole.role as any)?.roleName !== "superAdmin")
			) {
				throw new CustomGraphQLError(
					"You do not have permission to perform this action"
				);
			}
			try {
				const existingRecord = await cohortModels.findOne({ title: args.cohortFields.title });

				if (existingRecord) {
					throw new CustomGraphQLError(
						`the cohort with same title exist`
					);
				}

				const userInputs = await cohortModels.create(args.cohortFields);
				return userInputs;
			} catch (error) {
				throw new CustomGraphQLError(`Something went wrong: ${error}`);
			}
		},
    }
}