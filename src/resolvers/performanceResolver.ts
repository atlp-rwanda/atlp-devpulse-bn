import { PerformanceModel } from "../models/performanceModel";
import TraineeApplicant from "../models/traineeApplicant";
import mongoose from "mongoose";
import { CustomGraphQLError } from "../utils/customErrorHandler";

export const performanceResolver: any = {
    Query: {
        async getTraineePerformance(_: any, { traineeId }: any) {

            try{
                const performances = await PerformanceModel.find({ trainee: traineeId});
                if(performances.length === 0){
                    throw new CustomGraphQLError("No performance data found for this trainee")
                }
                const averageScore = performances.reduce((sum, perf) => sum + perf.score, 0) / performances.length;

                return { performances, averageScore };

            } catch(err){
                throw new CustomGraphQLError(`Something went wrong: ${err}`)
            }
        }
    },

    Mutation: {
        async addTraineePerformance(_: any, { input }: any) {
            try{
                const newPerformance = await PerformanceModel.create(input);
                return newPerformance

            } catch(err){
                throw new CustomGraphQLError(`Failed to add performance record: ${err}`)
            }
        }
    }
}