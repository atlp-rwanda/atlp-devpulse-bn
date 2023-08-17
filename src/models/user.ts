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
  profile: String,
  role: {
    type: String, 
    enum: ["applicant", "admin"],
  },
});

export const userModel = model("LoggedUser", userSchema);
