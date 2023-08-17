import { model, Schema } from "mongoose";
const userSchema = new Schema({
  createdAt: String,
  name: String,
  email: {
    type: String,
    required: true,
    unique: true,
  },
  picture: String,
  role: {
    type: String, 
    enum: ["applicant", "admin"],
    
  },
});

export const LoggedUserModel = model("LoggedUserModel", userSchema);
