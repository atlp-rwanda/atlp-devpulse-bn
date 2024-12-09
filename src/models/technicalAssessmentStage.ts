import mongoose, { Schema, Document } from "mongoose";

interface ITechnicalAssessment extends Document {
  applicantId: mongoose.Schema.Types.ObjectId;
  status: "No action" | "Invited"| "Moved" | "Rejected" | "Admitted";
  score: number;
  invitationLink: string;
  platform:string;
  comments?: string;
}

const technicalAssessmentSchema = new Schema<ITechnicalAssessment>({
  applicantId: {
    type: Schema.Types.ObjectId,
    ref: "Trainees",
    required: true,
  },
  status: {
    type: String,
    enum: ["No action", "Invited", "Moved","Passed", "Rejected", "Admitted"],
    default: "No action",
  },
  score: {
    type: Number,
    min: 0,
    max: 100,
    default:null
  },
  platform:{
    type:String,
  },
  invitationLink:{
    type:String,
  },
  comments: {
    type: String,
  },
},{
  timestamps: true
});

const TechnicalAssessment = mongoose.model<ITechnicalAssessment>(
  "TechnicalAssessment",
  technicalAssessmentSchema
);

export default TechnicalAssessment;
