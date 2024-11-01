import mongoose, { Schema, Document } from "mongoose";

interface IDismissed extends Document {
  applicantId: mongoose.Schema.Types.ObjectId;
  stageDismissedFrom: string;
  comments?: string;
}

const dismissedSchema = new Schema<IDismissed>({
  applicantId: {
    type: Schema.Types.ObjectId,
    ref: "Applicant",
    required: true,
  },
  stageDismissedFrom: {
    type: String,
    required: true,
  },
  comments: {
    type: String,
  },
});

const Dismissed = mongoose.model<IDismissed>("Dismissed", dismissedSchema);
export default Dismissed;
