import { model, Schema } from "mongoose";
const userSchema = new Schema(
  {
    firstname: String,
    lastname: String,
    email: {
      type: String,
      required: true,
      unique: true,
    },
    code: String,
    picture: {
      type: String,
      default: process.env.DEFAULT_AVATAR,
    },
    role: {
      type: Schema.Types.ObjectId,
      ref: "Role", // Reference to the 'Role' model
    },
    password: String,
    country: String,
    telephone: String,
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    resetToken: String,
  resetTokenExpiration: Date,
  },
  { timestamps: true }
);

export const LoggedUserModel = model("LoggedUserModel", userSchema);
