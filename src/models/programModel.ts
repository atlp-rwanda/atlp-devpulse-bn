// program.model.ts
import { model, Schema } from 'mongoose';

const ProgramSchema = new Schema({
  title: {
    type: String,
    unique: true, // Ensures program names are unique
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  mainObjective: {
    type: String,
    require: true,
  },
  requirements: {
    type: [String],
    required: true,
  },
  modeOfExecution: {
    type: String,
    required: true,
  },
},
{ timestamps: true }
);

export const ProgramModel = model("ProgramModel", ProgramSchema )
