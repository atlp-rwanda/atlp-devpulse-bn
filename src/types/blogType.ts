import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLList,
  GraphQLBoolean,
} from "graphql";
import { UserType } from "./userType";
import { LikeType } from "./likeType";
import { CommentType } from "./commentType";

export const BlogType = new GraphQLObjectType({
  name: "Blog",
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    content: { type: GraphQLString },
    coverImage: { type: GraphQLString },
    images: { type: new GraphQLList(GraphQLString) },
    author: { type: UserType },
    tags: { type: new GraphQLList(GraphQLString) },
    isHidden: { type: GraphQLBoolean },
    created_at: { type: GraphQLString },
    updated_at: { type: GraphQLString },
    likes: { type: new GraphQLList(LikeType) },
    comments: { type: new GraphQLList(CommentType) },
  }),
});
