import mongoose, { Schema, Document } from "mongoose";

interface IAdmitted extends Document {
  applicantId: mongoose.Schema.Types.ObjectId;
  status: string;
  interviewScore?: number;
  comments?: string;
}

const admittedSchema = new Schema<IAdmitted>({
  applicantId: {
    type: Schema.Types.ObjectId,
    ref: "Trainee",
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  comments: {
    type: String,
  },
});

const Admitted = mongoose.model<IAdmitted>("Admitted", admittedSchema);
export default Admitted;
