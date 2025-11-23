'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Post } from '../../types';
import PostCard from '../../components/PostCard';
import Link from 'next/link';

export default function TagPage() {
  const params = useParams();
  const tagName = decodeURIComponent(params.tagName as string);

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [relatedTags, setRelatedTags] = useState<string[]>([]);

  useEffect(() => {
    const fetchPostsByTag = async () => {
      try {
        setLoading(true);

        // Fetch all published posts
        const q = query(
          collection(db, 'posts'),
          where('isDraft', '==', false)
        );

        const querySnapshot = await getDocs(q);
        const filteredPosts: Post[] = [];
        const tagCounts: { [key: string]: number } = {};

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const post = {
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date(),
          } as Post;

          // Check if post has the tag
          if (post.tags?.some(tag => tag.toLowerCase() === tagName.toLowerCase())) {
            filteredPosts.push(post);

            // Count related tags
            post.tags.forEach(tag => {
              if (tag.toLowerCase() !== tagName.toLowerCase()) {
                tagCounts[tag] = (tagCounts[tag] || 0) + 1;
              }
            });
          }
        });

        // Sort posts by date
        filteredPosts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

        // Get top 5 related tags
        const sortedRelatedTags = Object.entries(tagCounts)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 5)
          .map(([tag]) => tag);

        setPosts(filteredPosts);
        setRelatedTags(sortedRelatedTags);
      } catch (err) {
        console.error('Error fetching posts by tag:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPostsByTag();
  }, [tagName]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center">Loading posts...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      {/* Tag Header */}
      <div className="mb-12">
        <Link href="/" className="text-blue-600 hover:underline text-sm mb-4 inline-block">
          ← Back to home
        </Link>
        <h1 className="text-5xl font-bold mb-4">#{tagName}</h1>
        <p className="text-xl text-gray-600">
          {posts.length} {posts.length === 1 ? 'post' : 'posts'} with this tag
        </p>

        {/* Related Tags */}
        {relatedTags.length > 0 && (
          <div className="mt-6">
            <p className="text-sm text-gray-600 mb-3">Related tags:</p>
            <div className="flex flex-wrap gap-2">
              {relatedTags.map((tag) => (
                <Link
                  key={tag}
                  href={`/tag/${tag}`}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-full text-sm transition"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Posts */}
      {posts.length === 0 ? (
        <div className="text-center py-16 border border-gray-200 rounded-lg">
          <p className="text-xl text-gray-600 mb-2">No posts found with this tag</p>
          <Link href="/" className="text-blue-500 hover:underline">
            Explore all posts
          </Link>
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