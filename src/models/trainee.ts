import mongoose, { model,Schema } from "mongoose";
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

const Trainee = model("Trainee", traineeSchema);
export default Trainee;
