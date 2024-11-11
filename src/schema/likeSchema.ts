import { gql } from "apollo-server-core";

export const likeSchema = gql`
  type LoggedUserModel {
    id: ID
    createdAt: String
    firstName: String
    lastName: String
    email: String
    role: String
    profile: String
    isEmailVerified: Boolean
    status: Boolean
    resetToken: String
    resetTokenExpiration: String
    cohort: ID
  }

  type Comment {
    id: ID!
    content: String!
    user: LoggedUserModel!
    blog: Blog!
    createdAt: String
  }

  type Blog {
    id: ID
    title: String
    content: String
    coverImage: String
    images: [String]
    author: LoggedUserModel
    tags: [String]
    isHidden: Boolean
    created_at: String
    updated_at: String
    likes: [Like]
    comments: [Comment]
  }

  type Like {
    id: ID!
    user: LoggedUserModel!
    blog: Blog!
  }

  type Query {
    getLikesByBlog(blog: ID!): [Like!]!
  }

  input LikeInput {
    user: ID!
    blog: ID!
  }

  type Mutation {
    addLike(likeFields: LikeInput): Like!
  }
`;
