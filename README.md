# 📝 Special Blog - A Modern Publishing Platform

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
- Author following (ready for implementation)

### 🎨 Modern UI/UX
- **Beautiful gradient design** with purple-to-pink theme
- Animated background blobs
- **Dark mode support** with theme persistence
- Responsive design (mobile, tablet, desktop)
- Smooth transitions and hover effects
- Glass-morphism effects
- Loading states with spinners

### ⚡ Performance & Optimization
- React Query for data caching and optimization
- Optimistic UI updates
- Server-side rendering (SSR)
- Static site generation (SSG) ready
- Image optimization
- Code splitting

## 🚀 Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **Tiptap** - Rich text editor
- **React Query** - Data fetching and caching

### Backend & Database
- **Firebase Authentication** - User management
- **Cloud Firestore** - NoSQL database
- **Firebase Hosting** - Deployment (optional)

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Turbopack** - Fast development server

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18.0 or higher)
- **npm** or **yarn** package manager
- A **Firebase account** (free tier works)

## 🛠️ Installation

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
   - **Authentication** (Email/Password)
   - **Firestore Database** (Start in test mode)
4. Get your Firebase configuration:
   - Go to Project Settings > General
   - Scroll to "Your apps" section
   - Click the web icon (`</>`)
   - Copy the configuration object

### 4. Configure Firebase

Open `lib/firebase.ts` and replace the configuration:

```typescript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

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
├── app/                      # Next.js App Router
│   ├── login/               # Login page
│   ├── signup/              # Signup page
│   ├── write/               # Create/Edit post
│   ├── post/[postId]/       # Individual post page
│   ├── profile/[userId]/    # User profile page
│   ├── search/              # Search results
│   ├── tag/[tagName]/       # Tag filtering
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home page
│   └── globals.css          # Global styles
├── components/              # Reusable components
│   ├── Header.tsx           # Navigation header
│   ├── Footer.tsx           # Page footer
│   ├── PostCard.tsx         # Post preview card
│   ├── TextEditor.tsx       # Rich text editor
│   ├── LikeButton.tsx       # Like/clap button
│   ├── Comments.tsx         # Comments section
│   └── SearchBar.tsx        # Search input
├── hooks/                   # Custom React hooks
│   ├── usePosts.ts          # Fetch posts
│   ├── usePostsQuery.ts     # React Query hooks
│   ├── useUser.ts           # Fetch user data
│   └── useLike.ts           # Like functionality
├── lib/                     # Utility functions
│   ├── firebase.ts          # Firebase config
│   ├── AuthContext.tsx      # Auth state management
│   ├── ThemeContext.tsx     # Theme management
│   └── QueryProvider.tsx    # React Query provider
├── types/                   # TypeScript types
│   └── index.ts             # Type definitions
└── public/                  # Static assets
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

## 🎨 Customization

### Change Color Theme

Edit the gradient colors in `app/page.tsx`:

```typescript
// Hero section
className="bg-gradient-to-br from-YOUR-COLOR via-YOUR-COLOR to-YOUR-COLOR"

// Buttons
className="bg-gradient-to-r from-YOUR-COLOR to-YOUR-COLOR"
```

Popular combinations:
- Ocean: `from-cyan-500 via-blue-500 to-indigo-600`
- Sunset: `from-orange-400 via-pink-500 to-purple-600`
- Forest: `from-emerald-400 via-teal-500 to-cyan-600`

### Modify Editor Toolbar

Edit `components/TextEditor.tsx` to add/remove formatting buttons.

## 📱 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import your repository
4. Vercel will auto-detect Next.js
5. Click "Deploy"

### Environment Variables

No environment variables needed as Firebase config is in the code. For production, consider moving config to environment variables.

## 🔒 Security Notes

### Firestore Security Rules

Update your Firestore rules for production:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Posts collection
    match /posts/{postId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
        request.auth.uid == resource.data.authorId;
    }
    
    // Comments collection
    match /comments/{commentId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
        request.auth.uid == resource.data.authorId;
    }
  }
}
```

## 🐛 Troubleshooting

### Firebase Index Errors
If you see "requires an index" errors:
1. Click the link in the error message
2. Firebase will create the index automatically
3. Wait 1-2 minutes for index to build
4. Refresh your app

### Dark Mode Not Persisting
Clear your localStorage and try again:
```javascript
localStorage.clear()
```

### Posts Not Appearing
1. Check Firebase Console > Firestore
2. Verify posts collection exists
3. Check that `isDraft` is set to `false`
4. Verify Firestore rules allow reading

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com

## 🙏 Acknowledgments

- [Next.js Documentation](https://nextjs.org/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Tiptap Editor](https://tiptap.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [React Query](https://tanstack.com/query)

## 📸 Screenshots

### Home Page
![Home Page](screenshots/home.png)

### Post Editor
![Editor](screenshots/editor.png)

### Dark Mode
![Dark Mode](screenshots/dark-mode.png)

---

Here is the deployed link: https://my-pahse-two-cpastone.vercel.app/

If you found this project helpful, please give it a ⭐!
