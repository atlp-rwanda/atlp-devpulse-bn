import axios from "axios";
import dotenv from 'dotenv';
import { BlogModel } from "../models/blogModel";


dotenv.config();
interface articleDef {
  image: string; 
  title: string; 
  url: string; 
  source: { name: string; }; 
  description: string; 
  publishedAt: String; 
}
export const blogRelatedResolvers = {
    Query: {
     blogRelatedArticles: async (_: any,{ blogId }: { blogId: string }) => {
        try{
        const blog = await BlogModel.findById(blogId);
        const tags = blog?.tags;

        if (!tags || tags.length === 0) {
          throw new Error('Blog tags are missing.');
        }
        const keywords = tags[Math.floor(Math.random() * tags.length)];
        const response = await axios.get('https://gnews.io/api/v4/search', {
          params: {
            q: keywords,
            token: process.env.Gnews_Api_Key,
            lang: 'en',
          },});
        return response.data.articles.map((article:articleDef ) => ({
          title: article.title,
          url: article.url,
          source: article.source.name,
          description: article.description,
          image: article.image,
          publishedAt: article.publishedAt
        }));
    } catch (error: any) {
        throw new Error("Failed to fetch related articles. Please try again later.");
      }
      },
    },
  };
  