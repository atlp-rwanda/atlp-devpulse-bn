import mongoose, { Schema } from "mongoose";

const AdminResponseSchema = new mongoose.Schema({
    body: {
        type: String,
        required: true,
    },
    respondedAt: {
        type: Date,
        default: Date.now
    },
    respondedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
})

export const ticketModel = mongoose.model("ticket", 
    new mongoose.Schema({
        title: {
            type: String,
            required: true,
        },
        body: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ['Open', 'AdminReply', 'ApplicantReply', 'Resolved'],
            default: 'Open',
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        updatedAt: {
            type: Date,
            default: Date.now,
        },
        author: {
            type: Schema.Types.ObjectId,
            ref: 'LoggedUserModel',
            required: true,
        },
        adminResponse: AdminResponseSchema,
        
       

    })
)