import { model, Schema } from "mongoose";


const application = new Schema(
  {
    firstName: String,
    lastName: String,
    email: String,
    telephone: String,
    availability_for_interview: String,
    gender: String,
    resume: String,
    comments: String,
    address: String,
    status: {
      type:String,
      default: "submitted"
    },
    formUrl: String,
    dateOfSubmission: String,
  },
  { timestamps: true }
);

export const applicant_records = model("applicant_records", application);
