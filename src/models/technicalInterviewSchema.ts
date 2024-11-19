import mongoose, { Schema, Document } from "mongoose";

interface ITechnicalInterview extends Document {
  applicantId: mongoose.Schema.Types.ObjectId;
  coordinatorId: mongoose.Schema.Types.ObjectId;
  meetingLink: string;
  scheduledDate: Date;
  meetingPlatform: string;
  status: string;
  emailSent: boolean;
}

const technicalInterviewSchema = new Schema<ITechnicalInterview>(
  {
    applicantId: {
      type: Schema.Types.ObjectId,
      ref: "Trainees",
      required: true,
    },
    coordinatorId: {
      type: Schema.Types.ObjectId,
      ref: "Trainees",
      required: true,
    },
    meetingLink: {
      type: String,
      required: true,
    },
    scheduledDate: {
      type: Date,
      required: true,
    },
    meetingPlatform: {
      type: String,
      enum: ["Zoom", "Teams"],
      required: true,
    },
    status: {
      type: String,
      enum: ["Scheduled", "Completed", "Cancelled", "No show"],
      default: "Scheduled",
    },
    emailSent: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const TechnicalInterview = mongoose.model<ITechnicalInterview>(
  "TechnicalInterview",
  technicalInterviewSchema
);
export default TechnicalInterview;
