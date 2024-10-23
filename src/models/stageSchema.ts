import mongoose, { Schema, Document } from "mongoose";

interface IStageTracking extends Document {
  traineeApplicant: mongoose.Schema.Types.ObjectId;
  stage:
    | "Shortlisted"
    | "Technical Assessment"
    | "Interview Assessment"
    | "Admitted"
    | "Dismissed";
  enteredAt: Date;
  exitedAt?: Date;
  comments?: string;
  score?: number;
  interviewScore?: number;
}

const stageTrackingSchema = new Schema<IStageTracking>({
  traineeApplicant: {
    type: Schema.Types.ObjectId,
    ref: "Applicant",
    required: true,
  },
  stage: {
    type: String,
    enum: [
      "Shortlisted",
      "Technical Assessment",
      "Interview Assessment",
      "Admitted",
      "Dismissed",
    ],
    required: true,
  },
  enteredAt: {
    type: Date,
    default: Date.now,
  },
  exitedAt: {
    type: Date,
  },
  comments: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
    required: function (this: IStageTracking) {
      return this.stage === "Technical Assessment";
    },
    validate: {
      validator: function (this: IStageTracking, value: number) {
        return (
          this.stage !== "Technical Assessment" || (value >= 0 && value <= 100)
        );
      },
      message: "Score must be between 0 and 100 for Technical Assessment",
    },
    default:0,
  },
  interviewScore: {
    type: Number,
    required: function (this: IStageTracking) {
      return this.stage === "Interview Assessment";
    },
    validate: {
      validator: function (this: IStageTracking, value: number) {
        return (
          this.stage !== "Interview Assessment" || (value >= 0 && value <= 2)
        );
      },
      message: "Interview score must be between 0 and 2",
    },
    default:0,
  }
});

const StageTracking = mongoose.model<IStageTracking>(
  "StageTracking",
  stageTrackingSchema
);

export default StageTracking;
