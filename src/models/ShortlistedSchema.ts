import mongoose, { Schema, Document } from "mongoose";

interface IShortlisted extends Document {
  applicantId: mongoose.Schema.Types.ObjectId;
  status: "No action" | "Moved" | "Dismissed" | "Admitted";
  comments?: string;
}

const shortlistedSchema = new Schema<IShortlisted>({
  applicantId: {
    type: Schema.Types.ObjectId,
    ref: "Trainee",
    required: true,

  },
  status: {
    type: String,
    enum: ["No action", "Moved", "Dismissed", "Admitted"],
    default: "No action",
  },
  comments: {
    type: String,
  },
},{
  timestamps: true,
});

const Shortlisted = mongoose.model<IShortlisted>("Shortlisted", shortlistedSchema);
export default Shortlisted;
