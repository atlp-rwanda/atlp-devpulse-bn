import { model, Schema } from "mongoose";
const userSchema = new Schema({
  createdAt: String,
  firstName: String,
  lastName: String,
  email: String
//   gender: String,
//   address: String,
//   age: Number,
//   phoneNumber: String,
//   fieldOfStudy: String,
//   levelOfEducation: String,
//   province: String,
//   district: String,
//   cohort: Number,
//   hackerankScore: String,
//   englishScore: Number,
});

export const userModel = model("UserUpdate12", userSchema);
