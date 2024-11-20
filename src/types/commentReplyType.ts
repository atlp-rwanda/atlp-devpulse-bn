import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLList,
} from "graphql";

export const CommentReplyType = new GraphQLObjectType({
  name: "CommentReply",
  fields: () => ({
    id: { type: GraphQLID },
    content: { type: GraphQLString },
    user: { type: GraphQLID },
    comment: { type: GraphQLID },
    created_at: { type: GraphQLString },
  }),
});
