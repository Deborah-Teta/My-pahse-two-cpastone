#  Special Blog - A Modern Publishing Platform

A full-featured blogging platform built with Next.js, React, Firebase, and TypeScript. Share your stories, connect with readers, and engage with a vibrant community of writers.

![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Firebase](https://img.shields.io/badge/Firebase-10.0-orange?style=for-the-badge&logo=firebase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-38B2AC?style=for-the-badge&logo=tailwind-css)

## ✨ Features

### 🔐 Authentication & User Management
- Email/password authentication with Firebase Auth
- User profiles with customizable bio and avatar
- Secure protected routes for authenticated users
- Profile editing and management

### 📄 Rich Content Creation
- **Tiptap Rich Text Editor** with full formatting support:
  - Headings (H1, H2, H3)
  - Bold, Italic, Strikethrough
  - Bullet and numbered lists
  - Blockquotes and code blocks
  - Image and link embedding
  - Undo/Redo functionality
- Cover image support
- Tag system for content categorization
- Draft and publish workflow
- Auto-save functionality (every 2 seconds)

### 📖 Content Discovery
- Home feed with latest published posts
- Search functionality (title, content, author, tags)
- Tag-based filtering and browsing
- Popular tags section
- Author profiles with all their posts
- Related tags suggestions

### 💬 Social Interactions
- Like/Clap system with real-time updates
- Comment system with nested replies
- Thread-based conversations
- View counter for posts
- Author following

### 🎨 Modern UI/UX
- Beautiful gradient design with purple-to-pink them
- Loading states with spinners
## Tech Stack

### Frontend
- Next.js  - React framework with App Router
- React 19 - UI library
- TypeScript - Type safety
- Tailwind CSS - Utility-first styling
- Tiptap - Rich text editor
- React Query - Data fetching and caching

### Backend & Database
- Firebase Authentication - User management
- **Firebase Hosting - Deployment (optional)

### Development Tools
- ESLint - Code linting
- Prettier - Code formatting
- Turbopack - Fast development server

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js(v18.0 or higher)
- npm package manager
- A Firebase account(free tier works)

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/medium-clone.git
cd medium-clone
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up Firebase

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project
3. Enable the following services:
   - Authentication (Email/Password)
   - Firestore Database(Start in test mode)
4. Get your Firebase configuration:
   - Go to Project Settings > General
   - Scroll to "Your apps" section
   - Click the web icon (`</>`)
   - Copy the configuration object

### 4. Configure Firebase

Open `lib/firebase.ts` and replace the configuration:

  

### 5. Set up Firestore indexes

After creating your first post, Firebase may prompt you to create indexes. Click the provided link in the console error and create the required indexes.

### 6. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
medium-clone/
├── app/                
│   ├── login/               
│   ├── signup/            
│   ├── write/               
│   ├── post/[postId]/       
│   ├── profile/[userId]/    
│   ├── search/             
│   ├── tag/[tagName]/       
│   ├── layout.tsx         
│   ├── page.tsx            
│   └── globals.css          
├── components/              
│   ├── Header.tsx           
│   ├── Footer.tsx          
│   ├── PostCard.tsx        
│   ├── TextEditor.tsx     
│   ├── LikeButton.tsx     
│   ├── Comments.tsx       
│   └── SearchBar.tsx        
├── hooks/                   
│   ├── usePosts.ts          
│   ├── usePostsQuery.ts     
│   ├── useUser.ts           
│   └── useLike.ts           
├── lib/                     
│   ├── firebase.ts          
│   ├── AuthContext.tsx      
│   ├── ThemeContext.tsx    
│   └── QueryProvider.tsx    
├── types/                   
│   └── index.ts            
└── public/                  
```

## 🎯 Key Features Explained

### Authentication Flow
1. User signs up with email/password
2. Firebase creates authentication record
3. User data saved to Firestore `users` collection
4. Auth state managed globally via Context
5. Protected routes redirect to login if not authenticated

### Post Creation Flow
1. User writes post in rich text editor
2. Content auto-saves to localStorage every 2 seconds
3. User can save as draft or publish immediately
4. Published posts appear on home feed
5. Drafts only visible to author on profile

### Comment System
1. Users can comment on any post
2. Comments support nested replies
3. Real-time updates when new comments added
4. Each comment shows author info and timestamp

### Search & Discovery
1. Client-side search across title, content, author, tags
2. Tag-based filtering for specific topics
3. Popular tags displayed on home page
4. Related tags shown on tag pages

## 🙏 Acknowledgments

- [Next.js Documentation](https://nextjs.org/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Tiptap Editor](https://tiptap.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [React Query](https://tanstack.com/query)

---

Here is the deployed link: https://my-pahse-two-cpastone.vercel.app/

