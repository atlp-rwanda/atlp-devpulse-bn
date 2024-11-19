import { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLEnumType } from "graphql";
import { UserType } from "./userType";
import { BlogType } from "./blogType";

export const ReactionEnumType = new GraphQLEnumType({
  name: "ReactionType",
  values: {
    LIKE: { value: "LIKE" },
    CELEBRATE: { value: "CELEBRATE" },
    SUPPORT: { value: "SUPPORT" },
    LOVE: { value: "LOVE" },
    FUNNY: { value: "FUNNY" },
  },
});

export const ReactionType = new GraphQLObjectType({
  name: "Reaction",
  fields: () => ({
    id: { type: GraphQLID },
    user: { type: UserType }, 
    blog: { type: BlogType }, 
    type: { type: ReactionEnumType }, 
    created_at: { type: GraphQLString }, 
  }),
});
