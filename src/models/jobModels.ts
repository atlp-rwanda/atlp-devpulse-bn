import mongoose from "mongoose";

export const jobModels = mongoose.model('jobform',
    new mongoose.Schema({
        title:{
            type:String,
            required:true
        },
        category: {
            type: String,
            required: true 
        },
        link:{
            type:String,
            required:true
        },
        description:{
            type:String,
            required:true
        },
    })
)
