import mongoose, { Schema, Document } from "mongoose";

interface ITechnicalAssessment extends Document {
  applicantId: mongoose.Schema.Types.ObjectId;
  status: "No action" | "Moved" | "Dismissed";
  score: number;
  comments?: string;
}

const technicalAssessmentSchema = new Schema<ITechnicalAssessment>({
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
  score: {
    type: Number,
    min: 0,
    max: 100,
  },
  comments: {
    type: String,
  },
});

const TechnicalAssessment = mongoose.model<ITechnicalAssessment>(
  "TechnicalAssessment",
  technicalAssessmentSchema
);

export default TechnicalAssessment;
