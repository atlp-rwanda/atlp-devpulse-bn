import { gradingModel } from "../models/grading";
import { LoggedUserModel } from "../models/AuthUser";
import { AuthenticationError } from "apollo-server-core";
import scoreTypesModel from "../models/scoreTypesModel";

const gradingResolver = {
  Query: {
    viewSingleGrading: async (_: any, { gradingId }: any, context: any) => {
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
          throw new AuthenticationError("Only superAdmin can create a grading");
        }
        const grading = await gradingModel.findById(gradingId);
        return grading;
      } catch (error: any) {
        throw new Error(`Error fetching single grading: ${error.message}`);
      }
    },

    viewAllGradings: async (
      _: any,
      { page, pageSize, searchParams }: any,
      context: any
    ) => {
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
          throw new AuthenticationError("Only superAdmin can create a grading");
        }
        const gradings = await gradingModel.find();
        return gradings;
      } catch (error: any) {
        throw new Error(`Error fetching gradings: ${error.message}`);
      }
    },
  },
  Mutation: {
    async createGrading(_: any, { gradingInput }: any, context: any) {
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
          throw new AuthenticationError("Only superAdmin can create a grading");
        }

        const { title, description, grades, assessment } = gradingInput;

        for (const grade of grades) {
          if (
            grade.scale.name === "Linear Scale" ||
            grade.scale.name === "Letter Grades"
          ) {
            if (
              typeof grade.scale.lowerValue.value === "number" &&
              typeof grade.scale.upperValue.value === "number"
            ) {
              if (
                grade.scale.lowerValue.value >= grade.scale.upperValue.value
              ) {
                throw new AuthenticationError(
                  "First value should not be greater or equal to the second value"
                );
              }
            } else if (
              typeof grade.scale.lowerValue.value === "string" &&
              typeof grade.scale.upperValue.value === "string"
            ) {
              if (
                grade.scale.lowerValue.value.localeCompare(
                  grade.scale.upperValue.value
                ) > 0
              ) {
                throw new AuthenticationError(
                  "First value should come before the second value alphabetically"
                );
              }
            }
          }
        }

        let newGrade = new gradingModel({
          title,
          assessment,
          description,
          grades,
        });

        await newGrade.save();
        return newGrade;
      } catch (error: any) {
        throw new Error(`Error creating grading: ${error.message}`);
      }
    },
  },
};

export default gradingResolver;
