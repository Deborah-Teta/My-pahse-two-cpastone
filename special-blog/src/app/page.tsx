'use client';

import { usePosts } from '../app/hooks/usePosts';
import PostCard from '../app/components/PostCard';
import SearchBar from '../app/components/searchBar';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../app/lib/firebase';

export default function Home() {
  const { posts, loading, error } = usePosts();
  const [popularTags, setPopularTags] = useState<string[]>([]);

  // Get popular tags
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const postsSnapshot = await getDocs(collection(db, 'posts'));
        const tagCounts: { [key: string]: number } = {};

        postsSnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.tags && Array.isArray(data.tags)) {
            data.tags.forEach((tag: string) => {
              tagCounts[tag] = (tagCounts[tag] || 0) + 1;
            });
          }
        });

        // Get top 10 tags
        const sortedTags = Object.entries(tagCounts)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 10)
          .map(([tag]) => tag);

        setPopularTags(sortedTags);
      } catch (err) {
        console.error('Error fetching tags:', err);
      }
    };

    fetchTags();
  }, []);

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
    <div className=" mx-auto px-4 py-1 ">
      {/* Hero Section with Search */}
      <div className="text-center mb-16 bg-gradient-to-br from-violet-00 via-purple-600 to-fuchsia-00 rounded-lg">
        <h1 className="text-6xl font-bold mb-6">
          Stay curious.
        </h1>
        <p className="text-xl text-gray-400 mb-8">
          Discover stories, thinking, and expertise from writers on any topic.
        </p>
        
        {/* Search Bar */}
        <div className="flex justify-center mb-8">
          <SearchBar />
        </div>

        {/* Popular Tags */}
        {popularTags.length > 0 && (
          <div className="mt-8">
            <p className="text-sm text-gray-200 mb-3">Popular tags:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {popularTags.map((tag) => (
                <Link
                  key={tag}
                  href={`/tag/${tag}`}
                  className="bg-green-600 hover:bg-green-900 text-gray-900 px-4 py-2 rounded-full text-sm transition"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Posts Grid */}
      {posts.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-xl text-gray-600 mb-4">No posts yet.</p>
          <p className="text-gray-500">Be the first to share your story!</p>
        </div>
      ) : (
        <>
          <h2 className="text-3xl font-bold mb-8">Latest Posts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 bg-gradient-to-br from-violet-00 via-purple-600 to-fuchsia-00 text-white ">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}