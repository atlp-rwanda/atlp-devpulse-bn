import mongoose, { Schema, Document } from "mongoose";

// Define a TypeScript interface for the scoreType document
interface IScoreType extends Document {
  title: string;
  description: string;
  modeOfEngagement: string;
  duration: number;
  startDate: Date | null;
  endDate: Date | null;
  program: mongoose.Types.ObjectId;
  durationUnit:string;
  grading:String;
}

const scoreTypeSchema = new Schema<IScoreType>({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  modeOfEngagement: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  durationUnit: {
    type: String, 
    enum: ["DAYS", "HOURS", "MINUTES","WEEKS","MONTHS"], 
    required: true,
  },
  startDate: {
    type: Date,
    default: null,
  },
  endDate: {
    type: Date,
    default: null,
  },
  program: {
    type: Schema.Types.ObjectId,
    ref: "ProgramModel",
  },
  grading: {
    type: Schema.Types.ObjectId,
    ref: "grading",
  },
},
{
  timestamps: true,
});

scoreTypeSchema.pre<IScoreType>("save", function (next) {
  if (this.startDate && this.duration) {
    const start = new Date(this.startDate);
    let durationInMilliseconds = 0;
    if (this.durationUnit === 'DAYS') {
      durationInMilliseconds = this.duration * 24 * 60 * 60 * 1000;
    } else if (this.durationUnit === 'HOURS') {
      durationInMilliseconds = this.duration * 60 * 60 * 1000;
    } else if (this.durationUnit === 'MINUTES') {
      durationInMilliseconds = this.duration * 60 * 1000;
    }else if (this.durationUnit === 'WEEKS') {
      durationInMilliseconds = this.duration * 7 * 24 * 60 * 60 * 1000;
    } else if (this.durationUnit === 'MONTHS') {
      // Approximate months to 30.44 days
      durationInMilliseconds = this.duration * 30.44 * 24 * 60 * 60 * 1000;
    }
     else {
      throw new Error("Invalid duration unit");
    }

    this.endDate = new Date(start.getTime() + durationInMilliseconds);
  }
  next();
});

const scoreTypesModel = mongoose.model<IScoreType>("Scores", scoreTypeSchema);

export default scoreTypesModel;
