import mongoose, { Schema } from "mongoose";

export const formModel = mongoose.model('forms',
    new mongoose.Schema({
        title:{
            type:String,
            required:true
        },
        description:{
            type:String,
            required:true
        },
        jobpost: {
            type: Schema.Types.ObjectId,
            ref: "jobform",
            required: true 
        },
        link:{
            type:String,
            required:true
        },
    })
)