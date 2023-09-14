import { model, Schema } from "mongoose";

const statusValues = ["submitted", "received", "deleted", "withdrawn", "old"];
const application = new Schema(
  {
    firstname: String,
    lastname: String,
    email: String,
    telephone: String,
    availability_for_interview: Date,
    gender: String,
    program: String,
    atlp_2_cohorts: String,
    resume: String,
    comments: String,
    address: String,
    atlp_1_cohorts: String,
    status: {
      type:String,
      enum: statusValues,
      default: "submitted"
    },
  },
  { timestamps: true }
);

export const applicant_records = model("applicant_records", application);
