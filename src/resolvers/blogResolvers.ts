import { BlogModel } from "../models/blogModel";
import { LikeModel } from "../models/likeModel";
import { CommentModel } from "../models/commentModel";
import {
  GraphQLBoolean,
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
} from "graphql";
import { BlogType } from "../types/blogType";

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
        tag: { type: GraphQLString }, // optional filter by tag
      },
      resolve: async (_: any, { tag }: GetAllBlogsArgs) => {
        const filter = tag ? { tags: tag } : {};
        return BlogModel.find(filter).populate("author likes comments");
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
            populate: { path: "user", model: "LogedUserModel" },
          });
      },
    },
  },

  Mutation: {
    createBlog: {
      type: BlogType,
      args: {
        title: { type: new GraphQLNonNull(GraphQLString) },
        content: { type: new GraphQLNonNull(GraphQLString) },
        coverImage: { type: new GraphQLNonNull(GraphQLString) },
        images: { type: new GraphQLList(GraphQLString) },
        author: { type: new GraphQLNonNull(GraphQLID) },
        tags: { type: new GraphQLList(GraphQLString) },
      },
      resolve: async (
        _: any,
        { title, content, coverImage, images, author, tags }: CreateBlogArgs
      ) => {
        const blog = new BlogModel({
          title,
          content,
          coverImage,
          images,
          author,
          tags,
        });
        return blog.save();
      },
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
