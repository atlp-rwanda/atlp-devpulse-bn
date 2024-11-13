import mongoose, { Schema, Document } from "mongoose";

interface IDismissed extends Document {
  applicantId: mongoose.Schema.Types.ObjectId;
  stageDismissedFrom: string;
  comments?: string;
  status: "Rejected"; // Added status field
  status: "Rejected"; // Added status field
}

const rejectedSchema = new Schema<IDismissed>({
  applicantId: {
    type: Schema.Types.ObjectId,
    ref: "Trainees",
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
    default: "Rejected",
    required: true,
  }
},{
  timestamps: true
});

const Rejected = mongoose.model<IDismissed>("Dismissed", rejectedSchema);
export default Rejected;
