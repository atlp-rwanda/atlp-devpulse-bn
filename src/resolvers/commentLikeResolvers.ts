import { GraphQLID, GraphQLList, GraphQLNonNull } from "graphql";
import { CommentLikeType } from "../types/commentLikeType";
import { CommentLikeModel } from "../models/commentLike";
import { CommentModel } from "../models/commentModel";

export const commentLikeResolvers = {
  Query: {
    getCommentLikes: {
      type: new GraphQLList(CommentLikeType),
      args: { blog: { type: new GraphQLNonNull(GraphQLID) } },
      resolve: async (_: any, { comment }: any) => {
        return await CommentLikeModel.find({ comment })
          .populate("user")
          .populate({
            path: "comment",
            populate: { path: "user" },
          });
      },
    },
  },
  Mutation: {
    addCommentLike: {
      type: CommentLikeType,
      args: {
        user: { type: new GraphQLNonNull(GraphQLID) },
        comment: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: async (_: any, { user, comment }: any) => {
        const like = new CommentLikeModel({ user, comment });
        await CommentModel.findByIdAndUpdate(comment, {
          $push: { likes: like._id },
        });
        const savedLike = await like.save();
        return (await savedLike.populate("user")).populate({
          path: "comment",
          populate: { path: "user" },
        });
      },
    },
  },
};
