import { BlogModel } from "../models/blogModel";
import { CommentModel } from "../models/commentModel";
import { LikeModel } from "../models/likeModel";
import { CommentLikeModel } from "../models/commentLike";
import { CommentReplyModel } from "../models/CommentReply";

const seedBlogs = async () => {
  await BlogModel.deleteMany({});
  await CommentModel.deleteMany({});
  await CommentLikeModel.deleteMany({});
  await LikeModel.deleteMany({});
  await CommentReplyModel.deleteMany({});
};

export default seedBlogs;
