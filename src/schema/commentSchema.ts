import { gql } from "apollo-server-core";

export const commentSchema = gql`
  type LoggedUserModel {
    id: ID
    createdAt: String
    firstname: String
    lastname: String
    email: String
    role: String
    profile: String
    isEmailVerified: Boolean
    status: Boolean
    resetToken: String
    resetTokenExpiration: String
    cohort: ID
    commentCount: Int
    likesCount: Int 
  }

  type Like {
    id: ID
    user: LoggedUserModel
    blog: Blog
    created_at: String
  }

  type CommentLike {
    id: ID
    user: LoggedUserModel
    comment: Comment
    created_at: String
  }

  type CommentReply {
    id: ID
    content: String
    user: LoggedUserModel
    comment: Comment
    created_at: String
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

  type Comment {
    id: ID
    content: String
    user: LoggedUserModel
    blog: Blog
    likes: [CommentLike]
    replies: [CommentReply]
    createdAt: String
    commentCount: Int
  }

  type Query {
    getCommentsByBlog(blog: ID!): [Comment!]!
    countCommentsByBlog(blog: ID!): Int!
  }

  input CommentInput {
    content: String!
    user: ID!
    blog: ID!
  }

  type Mutation {
    addComment(commentFields: CommentInput): Comment!
    updateComment(id: ID!, content: String!): Comment!
    deleteComment(id: ID!): String!
  }
`;
