'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Post } from '../types';
import PostCard from '../components/PostCard';
import SearchBar from '../components/searchBar';
import Link from 'next/link';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('q') || '';

  const [results, setResults] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const searchPosts = async () => {
      if (!searchQuery.trim()) {
        setResults([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Fetch all published posts
        const q = query(
          collection(db, 'posts'),
          where('isDraft', '==', false)
        );

        const querySnapshot = await getDocs(q);
        const allPosts: Post[] = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          allPosts.push({
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date(),
          } as Post);
        });

        // Client-side search (case-insensitive)
        const searchLower = searchQuery.toLowerCase();
        const filtered = allPosts.filter((post) => {
          const titleMatch = post.title.toLowerCase().includes(searchLower);
          const contentMatch = post.content.toLowerCase().includes(searchLower);
          const authorMatch = post.authorName.toLowerCase().includes(searchLower);
          const tagMatch = post.tags?.some(tag => 
            tag.toLowerCase().includes(searchLower)
          );

          return titleMatch || contentMatch || authorMatch || tagMatch;
        });

        // Sort by relevance (title matches first)
        filtered.sort((a, b) => {
          const aTitle = a.title.toLowerCase().includes(searchLower);
          const bTitle = b.title.toLowerCase().includes(searchLower);
          if (aTitle && !bTitle) return -1;
          if (!aTitle && bTitle) return 1;
          return b.createdAt.getTime() - a.createdAt.getTime();
        });

        setResults(filtered);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    };

    searchPosts();
  }, [searchQuery]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      {/* Search Bar */}
      <div className="mb-12">
        <div className="flex justify-center mb-6">
          <SearchBar />
        </div>
        <Link href="/" className="text-blue-600 hover:underline text-sm">
          ← Back to home
        </Link>
      </div>

      {/* Search Results */}
      <div>
        {loading ? (
          <div className="text-center py-16">Searching...</div>
        ) : searchQuery ? (
          <>
            <h2 className="text-3xl font-bold mb-2">
              Search Results for "{searchQuery}"
            </h2>
            <p className="text-gray-600 mb-8">
              Found {results.length} {results.length === 1 ? 'post' : 'posts'}
            </p>

            {results.length === 0 ? (
              <div className="text-center py-16 border border-gray-200 rounded-lg">
                <p className="text-xl text-gray-600 mb-2">No posts found</p>
                <p className="text-gray-500">Try different keywords</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {results.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <p className="text-xl text-gray-600">Enter a search query</p>
          </div>
        )}
      </div>
    </div>
  );
}