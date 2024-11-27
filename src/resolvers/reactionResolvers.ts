import { GraphQLInputObjectType, GraphQLID, GraphQLNonNull, GraphQLEnumType, GraphQLString, GraphQLInt, GraphQLBoolean } from "graphql";
import { ReactionModel } from "../models/reactionModel";
import { ReactionType as ReactionGraphQLType } from "../types/reactionType";
import { ReactionType } from "../models/reactionModel";  
import { BlogModel } from "../models/blogModel";
import mongoose from 'mongoose';


const addReaction = async (_: any, { reactionFields }: { reactionFields: any }) => {
  const reaction = new ReactionModel(reactionFields);
  await reaction.save();

  const blog = await BlogModel.findById(reactionFields.blog);
  if (blog) {
    await BlogModel.findByIdAndUpdate(
      reactionFields.blog,
      {
        $push: { reactions: reaction._id },
        $inc: { [`reactionsCount.${reactionFields.type}`]: 1 }, 
      },
      { new: true }
    );
  }

  const populatedReaction = await ReactionModel.findById(reaction._id)
    .populate("blog user");

  return populatedReaction;
};



const removeReaction = async (_: any, { user, blog }: { user: string, blog: string }) => {
  const reaction = await ReactionModel.findOneAndDelete({ user, blog });

  if (reaction) {
    await BlogModel.findByIdAndUpdate(blog, {
      $inc: { [`reactionsCount.${reaction.type}`]: -1 },
    });
  }

  return reaction != null; 
};

const getReactionsByBlog = async (_: any, { blog }: { blog: string }) => {
  return await ReactionModel.find({ blog }).populate("blog user")
};

const getAllReactionsCount = async (_: any, { blog }: { blog: string }) => {
  const reactionCount = await ReactionModel.countDocuments({ blog: new mongoose.Types.ObjectId(blog) });
  return reactionCount;
};

const getReactionsCountByBlogAndType = async (_: any, { blog, type }: { blog: string, type: string }) => {
  const reactionCount = await ReactionModel.countDocuments({
    blog: new mongoose.Types.ObjectId(blog),
    type: type.toUpperCase() 
  });
  return reactionCount;
};

export const reactionResolvers = {
  Mutation: {
    addReaction,
    removeReaction,
  },
  Query: {
    getReactionsByBlog,
    getAllReactionsCount,
    getReactionsCountByBlogAndType,
  },
};
