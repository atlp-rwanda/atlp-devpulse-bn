import mongoose from "mongoose";

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
        category: {
            type: String,
            enum: ["ATLP", "RCA", "Girls Program", "Vocation Program"],
            required: true 
        },
        link:{
            type:String,
            required:true
        },
    })
)