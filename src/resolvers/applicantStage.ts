import { RoleModel } from "../models/roleModel";
import TraineeApplicant from "../models/traineeApplicant";
import StageTracking from "../models/stageSchema";
import { CustomGraphQLError } from "../utils/customErrorHandler";

export const applicantStageResolvers: any = {
    Query: {
        getTraineeCyclesApplications: async (_: any, __: any, context: any) => {
            try {
                if (!context.currentUser) {
                    throw new CustomGraphQLError("You must be logged in to view your applications");
                }

                const applications = await TraineeApplicant.find({ user: context.currentUser._id })
                    .populate('cohort')
                    .populate('cycle_id');
                return applications;
            } catch (error: any) {
                throw new CustomGraphQLError(error.message);
            }
        },
        getCycleApplicationStages: async (_: any, { traineeApplicant }: any, context: any) => {
            try {
                if (!context.currentUser) {
                    throw new CustomGraphQLError("You must be logged in to view your application stages");
                }
                const stages = await StageTracking.find({ traineeApplicant });
                if (!stages || stages.length === 0) {
                    throw new CustomGraphQLError("No stages found for this application");
                }
                return { stages, message: "Stages retrieved successfully!" }
            } catch (error: any) {
                throw new CustomGraphQLError(error.message);
            }
        }
    },
    Mutation: {
        applyCycle: async (_: any, { cycle_id }: any, context: any) => {
            try {
                if (!context.currentUser) {
                    throw new CustomGraphQLError("You must be logged in to apply in the Cycle");
                }

                const [userRole, isUserAlreadyApplied] = await Promise.all([
                    RoleModel.findById(context.currentUser.role),
                    TraineeApplicant.findOne({ user: context.currentUser._id, cycle_id })
                ]);

                if (isUserAlreadyApplied) {
                    throw new CustomGraphQLError("You have already applied to this Cycle");
                }

                let newApplicationData = {
                    user: context.currentUser._id,
                    email: context.currentUser.email,
                    firstName: context.currentUser.firstName || " ",
                    lastName: context.currentUser.lastName || " ",
                    cycle_id: cycle_id
                };

                const newApplication = new TraineeApplicant(newApplicationData);
                await newApplication.save();

                return { message: "Application submitted successfully" };
            } catch (error: any) {
                throw new CustomGraphQLError(error.message);
            }
        }
    }
};
