import { model,Schema } from "mongoose";
const traineeSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required:true,
    },
})
export const TraineeApplicant = model("Trainee", traineeSchema);
