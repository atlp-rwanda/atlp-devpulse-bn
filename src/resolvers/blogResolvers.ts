import { BlogModel } from "../models/blogModel";
import mongoose from "mongoose";

import {
  GraphQLBoolean,
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
} from "graphql";
import { BlogType } from "../types/blogType";
import { LoggedUserModel } from "../models/AuthUser";
import { CustomGraphQLError } from "../utils/customErrorHandler";
import { publishNotification } from "./adminNotificationsResolver";

interface CreateBlogArgs {
  title: string;
  content: string;
  coverImage: string;
  images: string[];
  author: string;
  tags: string[];
}

interface GetAllBlogsArgs {
  tag?: string;
}

interface GetBlogByIdArgs {
  id: string;
}

interface GetBlogsByAuthorArgs {
  authorId: string;
}

interface UpdateBlogArgs {
  id: string;
  title?: string;
  content?: string;
  tags?: string[];
  isHidden?: boolean;
}

interface DeleteBlogArgs {
  id: string;
}

interface HideBlogArgs {
  id: string;
}

export const blogResolvers = {
  Query: {
    getAllBlogs: {
      type: new GraphQLList(BlogType),
      args: {
        tag: { type: GraphQLString },
      },
      resolve: async (_: any, { tag }: GetAllBlogsArgs, context: any) => {
        try {
          const userWithRole = context.currentUser
            ? await LoggedUserModel.findById(context.currentUser._id).populate("role")
            : null;

          const filter = tag ? { tags: tag } : {};
          const blogs = await BlogModel.find(filter).populate("author likes comments");

          return blogs.filter((blog) => {
            if (blog.isHidden) {
              if (userWithRole) {
                const authorId = blog.author._id;
                const currentUserId = context.currentUser._id;

                const isSameUser = new mongoose.Types.ObjectId(authorId).equals(new mongoose.Types.ObjectId(currentUserId));
                const isAdmin = ["admin", "superAdmin"].includes((userWithRole.role as any)?.roleName);

                // Show hidden blog if the user is the author or has an admins role
                return isSameUser || isAdmin;
              }
              return false;
            }
            return true;
          });
        } catch (error: any) {
          throw new CustomGraphQLError(`Error fetching blogs: ${error.message}`);
        }
      },
    },


    getBlogsByAuthor: {
      type: new GraphQLList(BlogType),
      args: {
        authorId: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: async (_: any, { authorId }: GetBlogsByAuthorArgs) => {
        return BlogModel.find({ author: authorId }).populate(
          "author likes comments"
        );
      },
    },

    getBlogById: {
      type: BlogType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve: async (_: any, { id }: GetBlogByIdArgs) => {
        return BlogModel.findById(id)
          .populate("author likes comments")
          .populate({
            path: "comments",
            populate: [
              { path: "user", model: "LogedUserModel" },
              {
                path: "likes",
                model: "CommentLike",
                populate: { path: "user", model: "LoggedUserModel" },
              },
              {
                path: "replies",
                model: "CommentReply",
                populate: { path: "user", model: "LoggedUserModel" },
              },
            ],
          });
      },
    },
  },

  Mutation: {
    createBlog: async (_: any, args: any, context: any) => {
      const userWithRole = await LoggedUserModel.findById(
        context.currentUser?._id
      ).populate("role");

      if (
        !userWithRole ||
        (userWithRole.role as any)?.roleName !== "applicant"
      ) {
        throw new CustomGraphQLError("Only Trainness can create blogs");
      }
      try {
        const existingRecord = await BlogModel.findOne({
          title: args.blogFields.title,
        });

        if (existingRecord) {
          throw new CustomGraphQLError(`A Blog with same title already exist`);
        }

        const blogInputs = await BlogModel.create(args.blogFields);
        await publishNotification(
          `New Blog ${args.blogFields.title} Created`,
          "Blog Creation"
        );
        return blogInputs;
      } catch (error) {
        throw new CustomGraphQLError(`Something went wrong: ${error}`);
      }
    },

    updateBlog: {
      type: BlogType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        title: { type: GraphQLString },
        content: { type: GraphQLString },
        tags: { type: new GraphQLList(GraphQLString) },
        isHidden: { type: GraphQLBoolean },
      },
      resolve: async (
        _: any,
        { id, title, content, tags, isHidden }: UpdateBlogArgs
      ) => {
        const updates = { title, content, tags, isHidden };
        return BlogModel.findByIdAndUpdate(id, updates, { new: true });
      },
    },

    deleteBlog: {
      type: GraphQLString,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve: async (_: any, { id }: DeleteBlogArgs) => {
        await BlogModel.findByIdAndDelete(id);
        return "Blog deleted successfully";
      },
    },

    hideBlog: async (_: any, { id }: HideBlogArgs, context: any) => {

      const userWithRole = await LoggedUserModel.findById(context.currentUser?._id).populate("role");

      if (!userWithRole ||
        !["admin", "superAdmin"].includes((userWithRole.role as any)?.roleName)) {
        throw new CustomGraphQLError("You do not have permission to hide this blog.");
      }
      const blogId = new mongoose.Types.ObjectId(id);

      const blog = await BlogModel.findById(blogId);
      if (!blog) {
        throw new CustomGraphQLError("Blog not found.");
      }

      blog.isHidden = !blog.isHidden;

      await blog.save();

      return blog;
    },
  },
};
