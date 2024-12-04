import mongoose, { Schema, model } from "mongoose";

const arrayLimit = (val: string[]) => val.length <= 4;

const blogSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  coverImage: {
    type: String,
    required: true,
  },
  images: {
    type: [String],
    validate: [arrayLimit, "{PATH} exceeds the limit of 4"],
  },
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: "Like",
    },
  ],
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
  commentLikesCount: {
    type: Number,
    default: 0,
  },
  reactions: [
    {
      type: Schema.Types.ObjectId,
      ref: "Reaction", 
    },
  ],
  reactionsCount: {
    LIKE: { type: Number, default: 0 },
    LOVE: { type: Number, default: 0 },
    CELEBRATE: { type: Number, default: 0 },
    SUPPORT: { type: Number, default: 0 },
    FUNNY: { type: Number, default: 0 },
  },
  
  isHidden: {
    type: Boolean,
    default: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "LoggedUserModel",
    required: true,
  },
  tags: {
    type: [String],
    index: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
  },
});

export const BlogModel = model("Blog", blogSchema);