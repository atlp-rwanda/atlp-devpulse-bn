import { model, Schema } from "mongoose";

const applicantNotificationsSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  eventType: {
    type: String,
    enum: ["jobPost", "applicationUpdate", "general"],
    required: true,
  },
  read: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const ApplicantNotificationsModel = model("ApplicantNotifications", applicantNotificationsSchema);
