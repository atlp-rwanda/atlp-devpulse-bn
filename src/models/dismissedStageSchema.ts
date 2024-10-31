import mongoose, { Schema, Document } from "mongoose";

interface IDismissed extends Document {
  applicantId: mongoose.Schema.Types.ObjectId;
  stageDismissedFrom: string;
  comments?: string;
  status: "Dismissed"; // Added status field
}

const dismissedSchema = new Schema<IDismissed>({
  applicantId: {
    type: Schema.Types.ObjectId,
    ref: "Trainee",
    required: true,
  },
  stageDismissedFrom: {
    type: String,
    required: true,
  },
  comments: {
    type: String,
  },
  status:{
    type: String,
    default: "Dismissed",
    required: true,
  }
},{
  timestamps: true
});

const Dismissed = mongoose.model<IDismissed>("Dismissed", dismissedSchema);
export default Dismissed;
