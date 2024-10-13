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
    isVerified:{
      type:Boolean,
      default:false
    },
    role: {
      type: Schema.Types.ObjectId,
      ref: "Role",
    },
    password: String,
    country: String,
    telephone: String,
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    applicationPhase: {
      type: String,
      enum: ["Applied", "Interviewed", "Accepted", "Enrolled"],
      default: "Applied",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,

    },
    cohort: {
      type: Schema.Types.ObjectId,
      ref: "cohortModel",
    },
    resetToken: String,
    resetTokenExpiration:Date

  },
  { timestamps: true }
);

export const LoggedUserModel = model("LoggedUserModel", userSchema);  