import mongoose, { model, Schema } from "mongoose";
const traineeSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  age: {
    type: Number,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  fieldOfStudy: {
    type: String,
    required: true,
  },
  highOrCurrentEducation: {
    type: String,
    required: true,
  },
  province: {
    type: String,
    required: true,
  },
  district: {
    type: String,
    required: true,
  },
  cohort: {
    type: Number,
    required: true,
  },
  employmentStatus: {
    type: String,
    required: true,
  },
  isStudent: {
    type: String,
    required: true,
  },
  hackerrankScore: {
    type: String,
  },
  englishScore: {
    type: String,
  },
  interview: {
    type: Number,
  },
  decision: {
    type: String,
  },
  pastAndela: {
    type: String,
  },
});
const Trainee = model("Trainee", traineeSchema);
export default Trainee;
