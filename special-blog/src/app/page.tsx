'use client';

import { usePosts } from '../app/hooks/usePosts';
import PostCard from '../app/components/PostCard';

export default function Home() {
  const { posts, loading, error } = usePosts(); // Fetch all published posts

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center">Loading posts...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center text-red-600">Error loading posts: {error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-6xl font-bold mb-6">
          Stay curious.
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Discover stories, thinking, and expertise from writers on any topic.
        </p>
      </div>

      {/* Posts Grid */}
      {posts.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-xl text-gray-600 mb-4">No posts yet.</p>
          <p className="text-gray-500">Be the first to share your story!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}