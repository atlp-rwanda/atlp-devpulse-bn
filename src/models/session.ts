import { model, Schema } from "mongoose"
const sessionSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    token: {
        type:String,
        required: true
    }
},{timestamps: true});

export const sessionModel = model("session", sessionSchema)