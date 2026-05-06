import { Category } from "./Category";

/** Represents a problem post in the feed. */
export type Problem = {
  /** Unique identifier. */
  id: number;
  /** Title of the problem. */
  title: string;
  /** Full description of the problem. */
  description: string;
  /** Username of the creator. */
  username: string;
  /** Optional URL to an attached image. */
  imageUrl?: string;
  /** ISO timestamp of when the problem was created. */
  createdAt: string;
  /** Total number of likes. */
  likeCount: number;
  /** Whether the current user has liked this problem. */
  likedByUser: boolean;
  /** Whether the current user created this problem. */
  createdByCurrentUser: boolean;
  /** Category the problem belongs to. */
  category: Category;
};
