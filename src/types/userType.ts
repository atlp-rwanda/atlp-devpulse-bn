import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLBoolean,
} from "graphql";

export const UserType = new GraphQLObjectType({
  name: "LoggedUserModel",
  fields: () => ({
    id: { type: GraphQLID },
    createdAt: { type: GraphQLString },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    email: { type: GraphQLString },
    role: { type: GraphQLString },
    profile: { type: GraphQLString },
    isEmailVerified: { type: GraphQLBoolean },
    status: { type: GraphQLBoolean },
    resetToken: { type: GraphQLString },
    resetTokenExpiration: { type: GraphQLString },
    cohort: { type: GraphQLID },
  }),
});
