import mongoose, { model, Schema } from "mongoose";

const traineeAttributeSchema = new Schema({
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
  },
  birth_date: {
    type: Date,
  },
  Address: {
    type: String,
  },
  phone: {
    type: String,
  },
  field_of_study: {
    type: String,
  },
  education_level: {
    type: String,
    enum: ['high school', 'university', 'masters', 'tvt'],
  },
  currentEducationLevel: {
    type: String,
    enum: ['highschool', 'university', 'masters', 'tvt'],
  },
  province: {
    type: String,
  },
  district: {
    type: String,
  },
  sector: {
    type: String,
  },
  isEmployed: {
    type: Boolean,
  },
  haveLaptop: {
    type: Boolean,
  },
  isStudent: {
    type: Boolean,
  },
  Hackerrank_score: {
    type: String,
  },
  english_score: {
    type: String,
  },
  interview: {
    type: Number,
  },
  interview_decision: {
    type: String,
  },
  past_andela_programs: {
    type: String,
  },
  applicationPost: {
    type: String,
    enum: ['Andela Twitter Handle', 'Got an email from Andela', 'Referred by a friend', 'Other'],
  },
  otherApplication: {
    type: String,
  },
  andelaPrograms: {
    type: String,
    enum: ['Web Development Crash Course', 'Andela Learning Community', 'Other'],
  },
  otherPrograms: {
    type: String,
  },
  understandTraining: {
    type: Boolean,
  },
  discipline: {
    type: String,
  },
  trainee_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Trainee",
    required: true,
  },
});

const traineEAttributes = model("Attributes", traineeAttributeSchema);

export { traineEAttributes };