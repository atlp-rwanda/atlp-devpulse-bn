import { AttendanceModel } from "../models/attendanceModel";
import TraineeApplicant from "../models/traineeApplicant";

const seedAttendance = async () => {
    const trainee = await TraineeApplicant.findOne();

    if(!trainee){
        return;
    }

    const attendance = [{
        trainee_id: trainee._id,
        date: new Date('2024-10-29'),
        status: 'Present'
    },
    {
        trainee_id: trainee._id,
        date: new Date('2024-09-20'),
        status: 'Absent'
    }

]

await AttendanceModel.deleteMany({attendance});
await AttendanceModel.insertMany({attendance});
}

export default seedAttendance;