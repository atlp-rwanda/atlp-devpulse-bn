import mongoose, { Schema } from "mongoose";

export const docModels = mongoose.model('docModel',
    new mongoose.Schema({
        title:{
            type:String,
        },
        description:{
            type:String,
        },
        role:{
            type:String
        }
    })
)
