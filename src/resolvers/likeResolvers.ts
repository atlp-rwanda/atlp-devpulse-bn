import { GraphQLID, GraphQLList, GraphQLNonNull } from "graphql";
import { LikeModel } from "../models/likeModel";
import { BlogModel } from "../models/blogModel";
import { LikeType } from "../types/likeType";

export const likeResolvers = {
  Query: {
    getLikesByBlog: {
      type: new GraphQLList(LikeType),
      args: { blog: { type: new GraphQLNonNull(GraphQLID) } },
      resolve: async (_: any, { blog }: any) => {
        return await LikeModel.find({ blog })
          .populate("user")
          .populate({
            path: "blog",
            populate: { path: "author" },
          });
      },
    },
  },
  Mutation: {
    addLike: {
      type: LikeType,
      args: {
        user: { type: new GraphQLNonNull(GraphQLID) },
        blog: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: async (_: any, { user, blog }: any) => {
        const like = new LikeModel({ user, blog });
        await BlogModel.findByIdAndUpdate(blog, { $push: { likes: like._id } });
        const savedLike = await like.save();
        return (await savedLike.populate("user")).populate({
          path: "blog",
          populate: { path: "author" },
        });
      },
    },
  },
};
