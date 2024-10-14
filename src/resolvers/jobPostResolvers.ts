import { LoggedUserModel } from "../models/AuthUser.js";
import { applicationCycle } from "../models/applicationCycle.js";
import { cohortModels } from "../models/cohortModel.js";
import { jobModels } from "../models/jobModels.js";
import { ProgramModel } from "../models/programModel.js";
import { CustomGraphQLError } from "../utils/customErrorHandler.js";

export const jobPostResolver = {
	Query: {
		getAllJobApplication: async (_: any, args: any, context: any) => {


			const { page, itemsPerPage, All } = args.input;

			const totalItems = (args.filter) ? await jobModels.countDocuments({ ...args.filter }) :
				await jobModels.countDocuments({});

			let pages;
			if (!Number.isNaN(page) && page > 0) {
				pages = page;
			}

			let size = 10;
			if (
				!Number.isNaN(itemsPerPage)
				&& !(itemsPerPage > 10)
				&& !(itemsPerPage < 1)
			) {
				size = itemsPerPage;
			}
			if (All) {

				size = totalItems;
			}

			const itemsToSkip = (pages - 1) * size;

			try {
				const formsData = (args.filter) ? await jobModels.find({ ...args.filter }).populate('program').populate('cycle').populate('cohort').skip(itemsToSkip).limit(size) :
					await jobModels.find().populate('program').populate('cycle').populate('cohort').skip(itemsToSkip).limit(size);
				if (formsData.length === 0) {
					throw new CustomGraphQLError(
						"no job post found"
					);
				}
				return formsData;
			} catch (error) {
				throw new CustomGraphQLError(`some thing went wrong ${error}`);
			}

		},
		getJobApplication: async (_: any, args: any, context: any) => {

			try {
				const forms = await jobModels.findOne({ _id: args.id });
				if (!forms) {
					throw new Error("no job post found");
				}
				return (await (await forms.populate('program')).populate('cycle')).populate('cohort');
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
				((userWithRole.role as any)?.roleName !== "admin" &&
					(userWithRole.role as any)?.roleName !== "superAdmin")
			) {
				throw new CustomGraphQLError(
					"You do not have permission to perform this action"
				);
			}
			try {
				const existingRecord = await jobModels.findOne({ title: args.jobFields.title });

				if (existingRecord) {
					throw new CustomGraphQLError(
						`A record with title ${args.jobFields.title} already exists.`
					);
				}

				if (!args.jobFields.title) {
					const programTitle = await ProgramModel.findById(args.jobFields.program);
					const cycle = await applicationCycle.findById(args.jobFields.cycle);
					const cohort = await cohortModels.findById(args.jobFields.cohort)
					const newfields = (args.jobFields.cohort) ?
						{ title: `${cycle?.name}-${programTitle?.title}-${cohort?.title}`, ...args.jobFields } :
						{ title: `${cycle?.name}-${programTitle?.title}`, ...args.jobFields };
					const userInputs = await jobModels.create(newfields);

					return (await (await userInputs.populate('program')).populate('cycle')).populate('cohort');
				}

				const userInputs = await jobModels.create(args.jobFields);
				return (await (await userInputs.populate('program')).populate('cycle')).populate('cohort');
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
				((userWithRole.role as any)?.roleName !== "admin" &&
					(userWithRole.role as any)?.roleName !== "superAdmin")
			) {
				throw new CustomGraphQLError(
					"You do not have permission to perform this action"
				);
			}
			try {
				const deleteJobApplication = await jobModels.findByIdAndDelete(args.id);

				return (deleteJobApplication === null) ? "No Job-Post to delete was found!!!" : "Job-Post deleted successfully";
			} catch (error) {
				throw new CustomGraphQLError(`Error deleting job application: ${error}`);
			}
		},
		updateJobApplication: async (_: any, args: any, context: any) => {
			const userWithRole = await LoggedUserModel.findById(
				context.currentUser?._id
			).populate("role");

			if (!userWithRole) {
				throw new CustomGraphQLError("User not found");
			}			

			if (
				!userWithRole ||
					(userWithRole.role as any)?.roleName !== "admin" &&
					(userWithRole.role as any)?.roleName !== "superAdmin"
			) {
				throw new CustomGraphQLError(
					"You do not have permission to perform this action"
				);
			}

			try {
				const updateJobApplication = await jobModels.findByIdAndUpdate(
					args.id,
					{ ...args.jobFields },
					{ new: true }
				);

				if (updateJobApplication !== null) {
					return (await (await updateJobApplication.populate('program')).populate('cycle')).populate('cohort');
				} else if (updateJobApplication === null || !updateJobApplication){
					throw new CustomGraphQLError("No Job-Post to update was found!!! ");
				}
			} catch (error) {
				throw new CustomGraphQLError(`Something went wrong: ${error}`);
			}
		},

	},
};
