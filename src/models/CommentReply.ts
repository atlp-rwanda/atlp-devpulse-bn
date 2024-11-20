import mongoose, { Schema, model } from "mongoose";

const commentReplySchema = new Schema({
  content: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "LoggedUserModel",
    required: true,
  },
  comment: {
    type: Schema.Types.ObjectId,
    ref: "Comment",
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

export const CommentReplyModel = model("CommentReply", commentReplySchema);
