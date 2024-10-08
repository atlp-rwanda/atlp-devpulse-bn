import { model, Schema } from "mongoose";

const userSchema = new Schema({
  createdAt: String,
  firstName: String,
  lastName: String,
  email: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    default: "applicant",
  },
  profile: String,
  password: String,
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  status: Boolean,
  resetToken: String,
  resetTokenExpiration: Date,
});

export const userModel = model("LoggedUser", userSchema);