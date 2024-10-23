import mongoose, { Schema, Document } from "mongoose";

interface IStageTracking extends Document {
  applicantId: mongoose.Schema.Types.ObjectId;
  currentStage: "Shortlisted" | "Technical Assessment" | "Interview Assessment" | "Admitted" | "Dismissed";
  history: [
    {
      stage: string;
      enteredAt: Date;
      exitedAt?: Date;
    }
  ];
}

const stageTrackingSchema = new Schema<IStageTracking>({
  applicantId: {
    type: Schema.Types.ObjectId,
    ref: "Trainee",
    required: true,
  },
  currentStage: {
    type: String,
    enum: ["Shortlisted", "Technical Assessment", "Interview Assessment", "Admitted", "Dismissed"],
    required: true,
  },
  history: [
    {
      stage: { type: String, required: true },
      enteredAt: { type: Date, default: Date.now },
      exitedAt: { type: Date },
    }
  ]
});

const StageTracking = mongoose.model<IStageTracking>("StageTracking", stageTrackingSchema);
export default StageTracking;
