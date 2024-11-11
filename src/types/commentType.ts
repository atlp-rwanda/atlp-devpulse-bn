import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLList,
} from "graphql";


export const CommentType = new GraphQLObjectType({
  name: "Comment",
  fields: () => ({
    id: { type: GraphQLID },
    content: { type: GraphQLString },
    user: { type: GraphQLID },
    blog: { type: GraphQLID },
    created_at: { type: GraphQLString },
  }),
});
