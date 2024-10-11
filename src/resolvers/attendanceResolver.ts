import { AttendanceModel } from "../models/attendanceModel";
import TraineeApplicant from "../models/traineeApplicant";
import { CustomGraphQLError } from "../utils/customErrorHandler";

export const attendanceResolver = {
    Query: {
        async getTraineeAttendance(_: any, { traineeId }: any) {

            try{
                const attendances = await AttendanceModel.find({ trainee: traineeId});
                if(attendances.length === 0){
                    throw new CustomGraphQLError("No attendance records found for this trainee")
                }


                const totalDays = attendances.length;
                const presentDays = attendances.filter(a => a.status === "Present").length;
                const attendanceRatio = `${presentDays}/${totalDays}`;

                return { attendances, attendanceRatio };

            } catch(err){
                throw new CustomGraphQLError(`Something went wrong: ${err}`)
            }
        }
    },

    Mutation: {
        async markAttendance(_: any, { input }: any){
            try{
                const newAttendance = await AttendanceModel.create(input);
                return newAttendance;

            } catch(err){
                throw new CustomGraphQLError(`Failed to ark attendance: ${err}`)
            }
        }
    }
}