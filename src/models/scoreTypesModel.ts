import mongoose, { model, Schema } from "mongoose";
const scoreTypesModel = mongoose.model(
  "Scores",
  new Schema({
    title:{
      type:String,
      required:true,
      unique:true
    },
    description:{
      type:String,
      required:true
    },
    modeOfEngagement:{
      type:String,
      required:true
    },
    duration:{
      type:String,
      required:true
    }
    ,
    startDate:{
      type:Date,
      default:null
    },
    endDate:{
      type:Date,
      default:null
    },
    program: {
      type: Schema.Types.ObjectId,
      ref: "ProgramModel", // Reference to the 'Role' model
    },
  },
  {
    timestamps:true
  }
  )
);

export default scoreTypesModel;
