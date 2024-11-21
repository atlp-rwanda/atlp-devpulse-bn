import { BlogModel } from "../models/blogModel";

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

export const blogResolvers = {
  Query: {
    getAllBlogs: {
      type: new GraphQLList(BlogType),
      args: {
        tag: { type: GraphQLString },
      },
      resolve: async (_: any, { tag }: GetAllBlogsArgs) => {
        const filter = tag ? { tags: tag } : {};
        return BlogModel.find(filter).populate("author likes comments");
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

      if (!userWithRole) {
        throw new CustomGraphQLError("User not found or not logged in");
      }
       const roleName = (userWithRole.role as any)?.roleName;

       if (!["applicant", "trainee"].includes(roleName)) {
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
  },
};
