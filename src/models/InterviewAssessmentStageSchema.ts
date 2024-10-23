import mongoose, { Schema, Document } from "mongoose";

interface IInterviewAssessment extends Document {
  applicantId: mongoose.Schema.Types.ObjectId;
  status: "No action" | "Moved" | "Dismissed";
  interviewScore: number;
  comments?: string;
}

const interviewAssessmentSchema = new Schema<IInterviewAssessment>({
  applicantId: {
    type: Schema.Types.ObjectId,
    ref: "Applicant",
    required: true,
  },
  status: {
    type: String,
    enum: ["No action", "Moved", "Dismissed"],
    default: "No action",
  },
  interviewScore: {
    type: Number,
    min: 0,
    max: 2,
  },
  comments: {
    type: String,
  },
});

const InterviewAssessment = mongoose.model<IInterviewAssessment>(
  "InterviewAssessment",
  interviewAssessmentSchema
);

export default InterviewAssessment;
