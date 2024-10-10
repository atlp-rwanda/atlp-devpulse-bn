import mongoose, { Schema, model} from "mongoose";

export const attendanceSchema = new Schema({
    trainee: {
        type: Schema.Types.ObjectId,
        ref: 'Trainee',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ['Present', 'Absent']
    }
})

export const AttendanceModel = model('Attendance', attendanceSchema);