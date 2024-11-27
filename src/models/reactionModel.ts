import mongoose, { Schema, model } from "mongoose";

export enum ReactionType {
  LIKE = "LIKE",
  CELEBRATE = "CELEBRATE",
  SUPPORT = "SUPPORT",
  LOVE = "LOVE",
  FUNNY = "FUNNY",
}

const reactionSchema = new Schema({
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
  type: {
    type: String,
    enum: Object.values(ReactionType), 
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

export const ReactionModel = model("Reaction", reactionSchema);