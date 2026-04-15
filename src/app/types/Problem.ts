import { Category } from "./Category";

export type Problem = {
  id: number;
  title: string;
  description: string;
  username: string;
  createdAt: string;
  likeCount: number;
  likedByUser: boolean;
  createdByCurrentUser: boolean;
  category: Category;
};
