// User type
export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  bio?: string;
  createdAt: Date;
}

// Post type
export interface Post {
  id: string;
  title: string;
  content: string; // HTML content from editor
  authorId: string;
  authorName: string;
  authorPhoto?: string;
  coverImage?: string;
  tags: string[];
  isDraft: boolean;
  createdAt: Date;
  updatedAt: Date;
  likes: number;
  views: number;
}

// Draft type (for local storage before publishing)
export interface Draft {
  title: string;
  content: string;
  coverImage?: string;
  tags: string[];
  lastSaved: Date;
}