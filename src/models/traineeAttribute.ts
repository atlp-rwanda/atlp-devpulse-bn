import mongoose, { model, Schema } from "mongoose";

const traineeAttributeSchema = new Schema({
  gender: {
    type: String,
    required: true,
    default: "-",
  },
  birth_date: {
    type: Date,
    required: true,
    default: "01/01/2000",
  },
  Address: {
    type: String,
    required: true,
    default: "-",
  },
  phone: {
    type: String,
    required: true,
    default: "-",
  },
  field_of_study: {
    type: String,
    required: true,
    default: "-",
  },
  education_level: {
    type: String,
    required: true,
    default: "-",
  },
  province: {
    type: String,
    required: true,
    default: "-",
  },
  district: {
    type: String,
    required: true,
    default: "-",
  },
  sector: {
    type: String,
    required: true,
    default: "-",
  },
  isEmployed: {
    type: Boolean,
    required: true,
    default: true,
  },
  haveLaptop: {
    type: Boolean,
    required: true,
    default: true,
  },
  isStudent: {
    type: Boolean,
    required: true,
    default: true,
  },
  Hackerrank_score: {
    type: String,
    required: true,
    default: "-",
  },
  english_score: {
    type: String,
    required: true,
    default: "-",
  },
  interview: {
    type: Number,
  },
  interview_decision: {
    type: String,
    required: true,
    default: "-",
  },
  past_andela_programs: {
    type: String,
    default: "none",
  },
  trainee_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Trainee",
    required: true,
  },
});

const traineEAttributes = model("Attributes", traineeAttributeSchema);

export { traineEAttributes };
