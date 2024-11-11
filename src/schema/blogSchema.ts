import { gql } from "apollo-server-core";

export const blogSchema = gql`
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

  type Blog {
    id: ID!
    title: String!
    content: String!
    coverImage: String!
    images: [String]
    likes: [Like]!
    comments: [Comment]!
    isHidden: Boolean
    author: LoggedUserModel!
    tags: [String]
    created_at: String
    updated_at: String
  }

  type Query {
    getBlogById(id: ID!): Blog
    getAllBlogs(tag: String): [Blog!]!
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
      isHidden: Boolean
    ): Blog!
    deleteBlog(id: ID!): String!
  }
`;
