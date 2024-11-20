import mongoose, { Schema, model } from "mongoose";

const likeSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "LoggedUserModel",
    required: true,
  },
  blog: {
    type: Schema.Types.ObjectId,
    ref: "Blog",
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

export const LikeModel = model("Like", likeSchema);
