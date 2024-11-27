import { gql } from "apollo-server-core";

export const blogSchema = gql`
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

  type Comment {
    id: ID
    content: String
    user: LoggedUserModel
    blog: Blog
    likes: [CommentLike]
    replies: [CommentReply]
    createdAt: String
  }

  type Reaction {
    id: ID
    user: LoggedUserModel
    blog: Blog
    type: ReactionType
    created_at: String
  }


  type Blog {
    id: ID!
    title: String!
    content: String!
    coverImage: String!
    images: [String]
    likes: [Like]!
    comments: [Comment]
    reactions: [Reaction]
    isHidden: Boolean
    author: LoggedUserModel!
    tags: [String]
    created_at: String
    updated_at: String
  }

  type Query {
    getBlogById(id: ID!): Blog
    getAllBlogs(tag: String): [Blog!]!
    getBlogsByAuthor(authorId: ID!): [Blog!]!
  }

  input BlogInput {
    title: String!
    content: String!
    coverImage: String!
    images: [String]
    author: ID!
    tags: [String]
  }

  type Mutation {
    createBlog(blogFields: BlogInput): Blog!
    updateBlog(
      id: ID!
      title: String
      content: String
      tags: [String]
    ): Blog!
    deleteBlog(id: ID!): String!
    hideBlog(id: ID!): Blog!
  }
`

  
