import mongoose, { Schema } from "mongoose";
const applicationCycleSchema = new Schema({
      name: {
        type: String,
        required: true,
        unique: true,
      },
      startDate: {
        type:String,
        required: true,
      },
      endDate: {
        type:String,
        required:true,
      }
    });

export const applicationCycle = mongoose.model('ApplicationCycle', applicationCycleSchema);

