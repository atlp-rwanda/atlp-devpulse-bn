import { GraphQLID, GraphQLList, GraphQLNonNull, GraphQLString } from "graphql";
import { CommentModel } from "../models/commentModel";
import { BlogModel } from "../models/blogModel";
import { CommentType } from "../types/commentType";
import { GraphQLInt } from "graphql";
import { CommentLikeModel } from "../models/commentLike";

interface AddCommentArgs {
  content: string;
  user: string;
  blog: string;
}

interface UpdateCommentArgs {
  id: string;
  content: string;
}

interface DeleteCommentArgs {
  id: string;
}

interface GetCommentsByBlogArgs {
  blog: string;
}

export const commentResolvers = {
  Query: {
    getCommentsByBlog: {
      type: new GraphQLList(CommentType),
      args: { blog: { type: new GraphQLNonNull(GraphQLID) } },
      resolve: async (_: any, { blog }: { blog: string }) => {
        try {
          const blogData = await BlogModel.findById(blog);
          if (!blogData) {
            throw new Error("Blog not found");
          }
  
          const comments = await CommentModel.find({ blog })
            .populate({
              path: "user",
              select: "_id firstname lastname email", 
            })
            .lean(); 
  
          const commentsWithLikes = await Promise.all(
            comments.map((comment) => ({
              ...comment,
              id: comment._id.toString(), 
              user: comment.user
                ? {
                    ...comment.user,
                    id: comment.user._id.toString(), 
                  }
                : null, 
            }))
          );
  
          return commentsWithLikes;
        } catch (error) {
          console.error("Error fetching comments by blog:", error);
          throw new Error("Failed to fetch comments by blog.");
        }
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
    updateComment: {
      type: CommentType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        content: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (_: any, { id, content }: UpdateCommentArgs) => {
        const updatedComment = await CommentModel.findByIdAndUpdate(
          id,
          { content },
          { new: true }
        )
          .populate("user")
          .populate({
            path: "blog",
            populate: { path: "author" },
          });

        if (!updatedComment) {
          throw new Error("Comment not found");
        }
        return updatedComment;
      },
    },
    deleteComment: {
      type: GraphQLString,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: async (_: any, { id }: DeleteCommentArgs) => {
        const deletedComment = await CommentModel.findByIdAndDelete(id);

        if (!deletedComment) {
          throw new Error("Comment not found");
        }

        await BlogModel.findByIdAndUpdate(deletedComment.blog, {
          $pull: { comments: id },
        });

        return "Comment deleted successfully";
      },
    },
  },
};


