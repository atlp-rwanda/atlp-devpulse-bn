import mongoose, { model, Schema, Document } from "mongoose";

interface ITraineeAttribute extends Document {
  gender?: 'male' | 'female' | 'other';
  birth_date?: Date;
  address?: string;
  phone?: string;
  study?: boolean;
  education_level?: 'high school' | 'university' | 'masters' | 'phd';
  currentEducationLevel?: 'highschool' | 'university' | 'masters' | 'phd';
  nationality: string;
  province?: string;
  district?: string;
  sector?: string;
  isEmployed?: boolean;
  haveLaptop?: boolean;
  isStudent?: boolean;
  Hackerrank_score?: string;
  english_score?: string;
  interview?: number;
  interview_decision?: string;
  applicationPost?: 'Andela Twitter Handle' | 'Got an email from Andela' | 'Referred by a friend' | 'Other';
  otherApplication?: string;
  andelaPrograms?: 'Web Development Crash Course' | 'Andela Learning Community' | 'Other';
  otherPrograms?: string;
  understandTraining?: boolean;
  discipline?: string;
  trainee_id: mongoose.Types.ObjectId;
}

const traineeAttributeSchema = new Schema<ITraineeAttribute>({
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
  },
  birth_date: {
    type: Date,
  },
  address: {
    type: String,
  },
  phone: {
    type: String,
  },
  study: {
    type: Boolean,
  },
  education_level: {
    type: String,
    enum: ['high school', 'university', 'masters', 'phd'],
  },
  currentEducationLevel: {
    type: String,
    enum: ['highschool', 'university', 'masters', 'phd'],
  },
  nationality: {
    type: String,
  },
  province: {
    type: String,
  },
  district: {
    type: String,
  },
  sector: {
    type: String,
  },
  isEmployed: {
    type: Boolean,
  },
  haveLaptop: {
    type: Boolean,
  },
  isStudent: {
    type: Boolean,
  },
  Hackerrank_score: {
    type: String,
  },
  english_score: {
    type: String,
  },
  interview: {
    type: Number,
  },
  interview_decision: {
    type: String,
  },
  applicationPost: {
    type: String,
    enum: ['Andela Twitter Handle', 'Got an email from Andela', 'Referred by a friend', 'Other'],
  },
  otherApplication: {
    type: String,
    required: function(this: ITraineeAttribute) {
      return this.applicationPost === 'Other';
    },
  },
  andelaPrograms: { 
    type: String,
    enum: ['Web Development Crash Course', 'Andela Learning Community', 'Other'],
  },
  otherPrograms: {
    type: String,
    required: function(this: ITraineeAttribute) {
      return this.andelaPrograms === 'Other';
    },
  },
  understandTraining: {
    type: Boolean,
  },
  discipline: {
    type: String,
  },
  trainee_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Trainee",
    required: true,
  },
});

const traineEAttributes = model<ITraineeAttribute>("Attributes", traineeAttributeSchema);

export { traineEAttributes, ITraineeAttribute };