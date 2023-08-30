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
    type: Schema.Types.ObjectId,
    ref: 'Role', // Reference to the 'Role' model
  },
  isActive:{
    type: Boolean,
    default: true
  } 
});

export const LoggedUserModel = model("LoggedUserModel", userSchema);
