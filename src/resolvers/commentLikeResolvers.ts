import {
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLInt,
  GraphQLObjectType,
} from "graphql";
import { CommentLikeModel } from "../models/commentLike";
import { CommentModel } from "../models/commentModel";

const CommentLikeDetailsType = new GraphQLObjectType({
  name: "CommentLikeDetails",
  fields: () => ({
    count: { type: GraphQLInt }, 
    likes: { type: new GraphQLList(GraphQLID) }, 
  }),
});

export const commentLikeResolvers = {
  Query: {
    getCommentLikes: {
      type: new GraphQLObjectType({
        name: "CommentLikes",
        fields: {
          count: { type: GraphQLInt },
        },
      }),
      args: { comment: { type: new GraphQLNonNull(GraphQLID) } },
      resolve: async (_: any, { comment }: any) => {
        try {
          const commentData = await CommentModel.findById(comment).select("likes");

          if (!commentData) {
            throw new Error("Comment not found.");
          }

          return { count: commentData.likes.length };
        } catch (error) {
          console.error("Error fetching comment likes:", error);
          throw new Error("Failed to fetch comment likes.");
        }
      },
    },
  },
  Mutation: {
    addCommentLike: {
      type: GraphQLInt, 
      args: {
        user: { type: new GraphQLNonNull(GraphQLID) },
        comment: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: async (_: any, { user, comment }: any) => {
        try {
          const existingLike = await CommentLikeModel.findOne({ user, comment });
          if (existingLike) {
            throw new Error("User has already liked this comment.");
          }

          const like = new CommentLikeModel({ user, comment });

          const savedLike = await like.save();
          const updatedComment = await CommentModel.findByIdAndUpdate(
            comment,
            { $push: { likes: savedLike._id } },
            { new: true }
          );

          if (!updatedComment) {
            throw new Error("Failed to update comment with the new like.");
          }

          const updatedLikeCount = updatedComment.likes.length;
          return updatedLikeCount;
        } catch (error) {
          console.error("Error adding comment like:", error);
          throw new Error("Failed to add comment like.");
        }
      },
    },
  },
};
