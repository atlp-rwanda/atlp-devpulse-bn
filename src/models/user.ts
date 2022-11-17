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
});

export const userModel = model("UserUpdate12", userSchema);
