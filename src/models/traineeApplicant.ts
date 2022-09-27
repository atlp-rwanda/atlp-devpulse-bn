import mongoose, { model,Schema } from "mongoose";
const TraineeApplicant = mongoose.model(
    "traineeSchema",
    new Schema({
        email: {
            type: String,
            required: true,
            unique: true,
        },
        firstname: {
            type: String,
            required: true,
        },
        lastname: {
            type: String,
            required:true,
        },
        delete_at: {
            type: Boolean, 
            default: false,
     
        }
    })
);

export default TraineeApplicant;