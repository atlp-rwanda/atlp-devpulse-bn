import { GraphQLID, GraphQLList, GraphQLNonNull, GraphQLString } from "graphql";
import { CommentModel } from "../models/commentModel";
import { BlogModel } from "../models/blogModel";
import { CommentType } from "../types/commentType";

interface AddCommentArgs {
  content: string;
  user: string;
  blog: string;
}

interface GetCommentsByBlogArgs {
  blog: string;
}

export const commentResolvers = {
  Query: {
    getCommentsByBlog: {
      type: new GraphQLList(CommentType),
      args: { blog: { type: new GraphQLNonNull(GraphQLID) } },
      resolve: async (_: any, { blog }: GetCommentsByBlogArgs) => {
        return await CommentModel.find({ blog })
          .populate("user")
          .populate({
            path: "blog",
            populate: { path: "author" },
          });
      },
    },
  },
  Mutation: {
    addComment: {
      type: CommentType,
      args: {
        content: { type: new GraphQLNonNull(GraphQLString) },
        user: { type: new GraphQLNonNull(GraphQLID) },
        blog: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: async (_: any, { content, user, blog }: AddCommentArgs) => {
        const comment = new CommentModel({ content, user, blog });
        await BlogModel.findByIdAndUpdate(blog, {
          $push: { comments: comment._id },
        });
        const savedComment = await comment.save();
        return (await savedComment.populate("user")).populate({
          path: "blog",
          populate: { path: "author" },
        });
      },
    },
  },
};
