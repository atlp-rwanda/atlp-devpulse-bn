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
});

export const LoggedUserModel = model("LoggedUserModel", userSchema);
