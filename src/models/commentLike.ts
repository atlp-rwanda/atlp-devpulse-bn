import mongoose, { Schema, model } from "mongoose";

const commentLikeSchema = new Schema({
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

export const CommentLikeModel = model("CommentLike", commentLikeSchema);
