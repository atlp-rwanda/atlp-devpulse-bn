import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLList,
} from "graphql";

export const LikeType = new GraphQLObjectType({
  name: "Like",
  fields: () => ({
    id: { type: GraphQLID },
    user: { type: GraphQLID },
    blog: { type: GraphQLID },
    created_at: { type: GraphQLString },
  }),
});
