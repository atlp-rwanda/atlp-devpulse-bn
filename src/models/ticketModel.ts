import mongoose, { Schema } from "mongoose";

const AdminReplySchema = new mongoose.Schema({
    body: {
        type: String,
        required: true,
    },
    repliedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'LoggedUserModel',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const ApplicantReplySchema = new Schema({
    body: {
        type: String,
        required: true
    },
    repliedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'LoggedUserModel',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

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
        applicantReplies: [ApplicantReplySchema],
        adminReplies: [AdminReplySchema]
        
       

    })
)