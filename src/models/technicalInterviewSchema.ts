import mongoose, { Schema, Document } from "mongoose";

interface ITechnicalInterview extends Document {
  applicantId: mongoose.Schema.Types.ObjectId;
  coordinatorId: mongoose.Schema.Types.ObjectId | null;
  meetingLink: string;
  scheduledDate: Date;
  meetingPlatform: string;
  status: string;
  emailSent: boolean;
}

interface PopulatedCoordinator {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  role: {
    roleName: string;
    description: string;
    permissions: string[];
  };
}

interface TechnicalInterview {
  _id: string;
  coordinatorId: PopulatedCoordinator;
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
      ref: "LoggedUserModel",
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
