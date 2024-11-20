import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLList,
} from "graphql";

export const CommentLikeType = new GraphQLObjectType({
  name: "CommentLike",
  fields: () => ({
    id: { type: GraphQLID },
    user: { type: GraphQLID },
    comment: { type: GraphQLID },
    created_at: { type: GraphQLString },
  }),
});
