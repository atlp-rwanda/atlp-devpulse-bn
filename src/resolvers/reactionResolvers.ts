import { GraphQLID, GraphQLList, GraphQLNonNull, GraphQLString } from "graphql";
import { ReactionModel } from "../models/reactionModel";
import { ReactionType as ReactionGraphQLType } from "../types/reactionType";
import { ReactionType } from "../models/reactionModel";  

interface AddReactionArgs {
  user: string;
  blog: string;
  type: ReactionType; 
}

interface RemoveReactionArgs {
  user: string;
  blog: string;
}

interface UpdateReactionArgs {
  user: string;
  blog: string;
  type: ReactionType;  
}

export const reactionResolvers = {
  Query: {
    getAllReactionsCount: {
      type: GraphQLString,
      resolve: async () => {
        const count = await ReactionModel.countDocuments();
        return `Total reactions: ${count}`;
      },
    },
    getReactionsCountByType: {
      type: GraphQLString,
      args: {
        type: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (_: any, { type }: { type: ReactionType }) => {
        const count = await ReactionModel.countDocuments({ type });
        return `Total reactions of type ${type}: ${count}`;
      },
    },
  },
  Mutation: {
    addReaction: {
      type: ReactionGraphQLType,
      args: {
        user: { type: new GraphQLNonNull(GraphQLID) },
        blog: { type: new GraphQLNonNull(GraphQLID) },
        type: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (_: any, { user, blog, type }: AddReactionArgs) => {
        const reaction = new ReactionModel({ user, blog, type });
        await reaction.save();
        const savedReaction = await ReactionModel.findById(reaction._id)
          .populate("user")
          .populate("blog");
        return savedReaction;
      },
    },
    removeReaction: {
      type: ReactionGraphQLType,
      args: {
        user: { type: new GraphQLNonNull(GraphQLID) },
        blog: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: async (_: any, { user, blog }: RemoveReactionArgs) => {
        const removedReaction = await ReactionModel.findOneAndDelete({ user, blog });
        if (!removedReaction) {
          throw new Error("Reaction not found for this user and blog.");
        }
        return removedReaction.populate("user blog");
      },
    },
    updateReactionType: {
      type: ReactionGraphQLType,
      args: {
        user: { type: new GraphQLNonNull(GraphQLID) },
        blog: { type: new GraphQLNonNull(GraphQLID) },
        type: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (_: any, { user, blog, type }: UpdateReactionArgs) => {
        const updatedReaction = await ReactionModel.findOneAndUpdate(
          { user, blog },
          { type },
          { new: true }
        );

        if (!updatedReaction) {
          throw new Error("Reaction not found for this user and blog.");
        }

        return updatedReaction.populate("user blog");
      },
    },
  },
};
