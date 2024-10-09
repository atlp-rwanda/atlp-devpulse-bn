import { LoggedUserModel } from "../models/AuthUser";
import { formModel } from "../models/formsModel";
import { jobModels } from "../models/jobModels";
import { CustomGraphQLError } from "../utils/customErrorHandler";

export const formsResolver = {
  Query: {
    getAllApplications: async (_: any, args: any, context: any) => {
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
        const formsData = await formModel.find();
        if (formsData.length === 0) {
          throw new CustomGraphQLError("no applications found");
        }
        return formsData;
      } catch (error) {
        throw new CustomGraphQLError(`some thing went wrong ${error}`);
      }
    },
    getApplication: async (_: any, args: any, context: any) => {
      const userWithRole = await LoggedUserModel.findById(
        context.currentUser?._id
      ).populate("role");
      if (
        !userWithRole ||
        ((userWithRole.role as any)?.roleName !== "managers" &&
          (userWithRole.role as any)?.roleName !== "superAdmin" &&
          (userWithRole.role as any)?.roleName !== "admin")
      ) {
        throw new CustomGraphQLError(
          "You do not have permission to perform this action"
        );
      }
      try {
        const forms: any = await formModel.findOne({ _id: args.id });
        if (forms.length === 0) {
          throw new Error("no applications found");
        }
        return forms;
      } catch (error) {
        throw new CustomGraphQLError(`some thing went wrong ${error}`);
      }
    },
  },
  Mutation: {
    createApplication: async (_: any, args: any, context: any) => {
      const userWithRole = await LoggedUserModel.findById(
        context.currentUser?._id
      ).populate("role");
      if (
        !userWithRole ||
        ((userWithRole.role as any)?.roleName !== "managers" &&
          (userWithRole.role as any)?.roleName !== "superAdmin" &&
          (userWithRole.role as any)?.roleName !== "admin")
      ) {
        throw new CustomGraphQLError(
          "You do not have permission to perform this action"
        );
      }
      try {
        const existingRecord = await formModel.findOne({ link: args.link });

        if (existingRecord) {
          throw new CustomGraphQLError(
            `A record with LINK ${args.link} already exists.`
          );
        }
        const jobPostExist = await jobModels.findById(args.jobpost);

        if (!jobPostExist) {
          throw new CustomGraphQLError("job post does not exist");
        }

        // const updateJobPost = await jobModels.findByIdAndUpdate(args.jobpost, { link: args.link,  });
        const updateJobPost = await jobModels.findByIdAndUpdate(args.jobpost, {
          link: args.link,
          spreadsheetlink: args.spreadsheetlink,
          formrange: args.formrange,
        });

        const userInputs = await formModel.create(args);

        return userInputs;
      } catch (error) {
        throw new CustomGraphQLError(`Something went wrong: ${error}`);
      }
    },
    deleteApplication: async (_: any, args: any, context: any) => {
      const userWithRole = await LoggedUserModel.findById(
        context.currentUser?._id
      ).populate("role");
      if (
        !userWithRole ||
        ((userWithRole.role as any)?.roleName !== "managers" &&
          (userWithRole.role as any)?.roleName !== "superAdmin" &&
          (userWithRole.role as any)?.roleName !== "admin")
      ) {
        throw new CustomGraphQLError(
          "You do not have permission to perform this action"
        );
      }
      try {
        const deletedApplication = await formModel.findByIdAndDelete(args.id);
        return deletedApplication;
      } catch (error) {
        throw new CustomGraphQLError(`Error deleting application: ${error}`);
      }
    },
    updateApplication: async (_: any, args: any, context: any) => {
      const userWithRole = await LoggedUserModel.findById(
        context.currentUser?._id
      ).populate("role");

      if (
        !userWithRole ||
        ((userWithRole.role as any)?.roleName !== "managers" &&
          (userWithRole.role as any)?.roleName !== "superAdmin" &&
          (userWithRole.role as any)?.roleName !== "admin")
      ) {
        throw new CustomGraphQLError(
          "You do not have permission to perform this action"
        );
      }

      try {
        const updatedApplication = await formModel.findByIdAndUpdate(
          args.id,
          args,
          { new: true }
        );
        return updatedApplication;
      } catch (error) {
        throw new CustomGraphQLError(`Something went wrong: ${error}`);
      }
    },
  },
};
