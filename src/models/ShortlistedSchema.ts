import mongoose, { Schema, Document } from "mongoose";

interface IShortlisted extends Document {
  applicantId: mongoose.Schema.Types.ObjectId;
  status: "No action" | "Moved" | "Dismissed";
  comments?: string;
}

const shortlistedSchema = new Schema<IShortlisted>({
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
  comments: {
    type: String,
  },
});

const Shortlisted = mongoose.model<IShortlisted>("Shortlisted", shortlistedSchema);
export default Shortlisted;
