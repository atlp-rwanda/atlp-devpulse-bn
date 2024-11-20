import { GraphQLInputObjectType, GraphQLID, GraphQLNonNull, GraphQLEnumType, GraphQLString } from "graphql";
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

const ReactionInput = new GraphQLInputObjectType({
  name: 'ReactionInput',
  fields: {
    user: { type: new GraphQLNonNull(GraphQLID) },
    blog: { type: new GraphQLNonNull(GraphQLID) },
    type: { type: new GraphQLNonNull(new GraphQLEnumType({  // Use GraphQLEnumType for ReactionType
      name: 'ReactionType',
      values: {
        LIKE: { value: 'LIKE' },
        CELEBRATE: { value: 'CELEBRATE' },
        SUPPORT: { value: 'SUPPORT' },
        LOVE: { value: 'LOVE' },
        FUNNY: { value: 'FUNNY' },
      },
    })) },
  },
});

export const reactionResolvers = {
  Query: {
    getAllReactionsCount: {
      type: GraphQLString,
      args: {
        blog: { type: new GraphQLNonNull(GraphQLID) },  
      },
      resolve: async (_: any, { blog }: { blog: string }) => {
        const count = await ReactionModel.countDocuments({ blog });
        return `Total reactions for blog with ID ${blog}: ${count}`;
      },
    },
    getReactionsCountByBlogAndType: {
      type: GraphQLString,
      args: {
        blog: { type: new GraphQLNonNull(GraphQLID) },  
        type: { type: new GraphQLNonNull(GraphQLString) },  
      },
      resolve: async (_: any, { blog, type }: { blog: string, type: string }) => {
   
        const count = await ReactionModel.countDocuments({ blog, type });
        return `Total reactions of type ${type} for blog with ID ${blog}: ${count}`;
      },
    },
  },
  Mutation: {
    addReaction: {
      type: ReactionGraphQLType,
      args: {
        reactionFields: { type: new GraphQLNonNull(ReactionInput) },
      },
      resolve: async (_: any, { reactionFields }: { reactionFields: AddReactionArgs }) => {
        const { user, blog, type } = reactionFields;
        const reaction = new ReactionModel({ user, blog, type });
        await reaction.save();
        const savedReaction = await ReactionModel.findById(reaction._id)
          .populate("user")
          .populate("blog");
        return savedReaction;
      },
    },
    removeReaction: {
      type: GraphQLString, 
      args: {
        user: { type: new GraphQLNonNull(GraphQLID) },
        blog: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: async (_: any, { user, blog }: RemoveReactionArgs) => {

        const removedReaction = await ReactionModel.findOneAndDelete({ user, blog });

        if (!removedReaction) {
          throw new Error("Reaction not found for this user and blog.");
        }
    
        return `Reaction successfully removed from user with ID ${user} for blog with ID ${blog}.`;
      },
    },
    },    
  };

