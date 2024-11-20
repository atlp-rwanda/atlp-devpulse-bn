import { GraphQLID, GraphQLList, GraphQLNonNull, GraphQLString } from "graphql";
import { CommentModel } from "../models/commentModel";
import { CommentReplyModel } from "../models/CommentReply";
import { CommentReplyType } from "../types/commentReplyType";

interface AddCommentReplyArgs {
  content: string;
  user: string;
  comment: string;
}

interface GetRepliesByCommentArgs {
  comment: string;
}

export const commentReplyResolvers = {
  Query: {
    getRepliesByComment: {
      type: new GraphQLList(CommentReplyType),
      args: { blog: { type: new GraphQLNonNull(GraphQLID) } },
      resolve: async (_: any, { comment }: GetRepliesByCommentArgs) => {
        return await CommentReplyModel.find({ comment })
          .populate("user")
          .populate({
            path: "comment",
            populate: { path: "user" },
          });
      },
    },
  },
  Mutation: {
    addCommentReply: {
      type: CommentReplyType,
      args: {
        content: { type: new GraphQLNonNull(GraphQLString) },
        user: { type: new GraphQLNonNull(GraphQLID) },
        comment: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: async (
        _: any,
        { content, user, comment }: AddCommentReplyArgs
      ) => {
        const commentReply = new CommentModel({ content, user, comment });
        await CommentModel.findByIdAndUpdate(comment, {
          $push: { comments: commentReply._id },
        });
        const savedCommentReply = await commentReply.save();
        return (await savedCommentReply.populate("user")).populate({
          path: "comment",
          populate: { path: "user" },
        });
      },
    },
  },
};
