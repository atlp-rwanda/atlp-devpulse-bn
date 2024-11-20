import { gql } from "apollo-server-express";

export const blogRelatedArticlesSchema = gql`

type Article  {
  title: String
  url: String
  source: String
  description: String
  image: String
  publishedAt: String
}

type Query {
  blogRelatedArticles(blogId: String!): [Article]
}
`;
