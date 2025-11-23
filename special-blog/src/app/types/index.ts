// User type
export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  bio?: string;
  createdAt: Date;
  followers?: string[]; // Array of user IDs who follow this user
  following?: string[]; // Array of user IDs this user follows
}

// Post type
export interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  authorPhoto?: string;
  coverImage?: string;
  tags: string[];
  isDraft: boolean;
  createdAt: Date;
  updatedAt: Date;
  likes: number;
  likedBy?: string[]; // Array of user IDs who liked this post
  views: number;
  commentsCount?: number;
}

// Comment type
export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorPhoto?: string;
  content: string;
  createdAt: Date;
  likes: number;
  likedBy?: string[];
  parentId?: string; // For nested replies
}

// Draft type (for local storage before publishing)
export interface Draft {
  title: string;
  content: string;
  coverImage?: string;
  tags: string[];
  lastSaved: Date;
}