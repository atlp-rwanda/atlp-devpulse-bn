import mongoose, { Schema } from "mongoose";
const applicationCycle = mongoose.model(
    "applicationCycle",
    new Schema({
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
    })
  );
  export {applicationCycle};