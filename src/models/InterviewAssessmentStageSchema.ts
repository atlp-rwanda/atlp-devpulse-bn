import mongoose, { Schema, Document } from "mongoose";

interface IInterviewAssessment extends Document {
  applicantId: mongoose.Schema.Types.ObjectId;
  status: "No action" | "Moved" | "Rejected" | "Admitted";
  interviewScore: number;
  comments?: string;
}

const interviewAssessmentSchema = new Schema<IInterviewAssessment>(
  {
    applicantId: {
      type: Schema.Types.ObjectId,
      ref: "Trainees",
      required: true,
    },
    status: {
      type: String,
      enum: ["No action", "Moved", "Rejected", "Admitted"],
      default: "No action",
    },
    interviewScore: {
      type: Number,
      min: 0,
      max: 2,
      validate: {
        validator: (value: number) =>
          value === null || (value >= 0 && value <= 2),
        message: "Score must be between 0 and 2.",
      },
    },
    comments: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const InterviewAssessment = mongoose.model<IInterviewAssessment>(
  "InterviewAssessment",
  interviewAssessmentSchema
);

export default InterviewAssessment;
