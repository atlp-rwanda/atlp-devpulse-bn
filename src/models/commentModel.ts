import mongoose, { Schema, model } from "mongoose";

const commentSchema = new Schema({
  content: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: "LoggedUserModel", required: true }, 
  blog: { type: Schema.Types.ObjectId, ref: "Blog", required: true },
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: "CommentLike", 
    },
  ],
  created_at: { type: Date, default: Date.now },
});

export const CommentModel = model("Comment", commentSchema);