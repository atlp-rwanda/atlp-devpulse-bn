import { model, Schema } from "mongoose";

 const assementSchema=new Schema({
    title:{
        type:String,
        require:true,
        unique:true
    },
    description:String,
    engagement:String,
    duration:String,
    startDate:Date,
    endDate:Date,
    program: {
        type: Schema.Types.ObjectId,
        ref: "ProgramModel",
      },
})

export const Assessement=model('assessement',assementSchema);