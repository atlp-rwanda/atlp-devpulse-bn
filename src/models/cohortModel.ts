import mongoose, { Schema } from "mongoose";

export const cohortModels = mongoose.model('cohortModel',
    new mongoose.Schema({
        title:{
            type:String,
            required:true
        },
        program:{
            type: Schema.Types.ObjectId,
            ref: "ProgramModel",
            required:true
        },
        cycle: {
            type: Schema.Types.ObjectId,
            ref: "applicationCycle",
            required: true 
        },
        phase:{
            type:Number,
            default: 1
        },
        start:{
            type:String,
            required:true
        },
        end:{
            type:String,
            required:true
        },
        trainees: [{
            type: Schema.Types.ObjectId,
            ref: "Trainee",
        }]
    })
)
