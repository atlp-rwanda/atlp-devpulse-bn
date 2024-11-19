import { gql } from "apollo-server-core";

export const reactionSchema = gql`
  enum ReactionType {
    LIKE
    CELEBRATE
    SUPPORT
    LOVE
    FUNNY
  }

  type Reaction {
    id: ID
    user: LoggedUserModel
    blog: Blog
    type: ReactionType
    created_at: String
  }

  type ReactionCount {
    type: ReactionType
    count: Int
  }

  type Query {
    getReactionsByBlog(blog: ID!): [Reaction!]!
    getReactionsCount(blog: ID!): Int!
    getReactionsCountByType(blog: ID!): [ReactionCount!]!
  }

  input ReactionInput {
    user: ID!
    blog: ID!
    type: ReactionType!
  }

  type Mutation {
    addReaction(reactionFields: ReactionInput): Reaction!
    removeReaction(user: ID!, blog: ID!): Boolean!
    updateReactionType(user: ID!, blog: ID!, type: ReactionType!): Reaction!
  }
`;
