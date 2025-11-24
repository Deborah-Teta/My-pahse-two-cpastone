'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../lib/AuthContext';
import { Post } from '../types';
import PostCard from '../components/PostCard';
import Link from 'next/link';

export default function FeedPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeed = async () => {
      if (!user) return;

      try {
        // Get user's following list
        const userDoc = await getDocs(query(collection(db, 'users'), where('uid', '==', user.uid)));
        let following: string[] = [];
        
        userDoc.forEach(doc => {
          following = doc.data().following || [];
        });

        if (following.length === 0) {
          setLoading(false);
          return;
        }

        // Fetch posts from followed authors
        const q = query(
          collection(db, 'posts'),
          where('authorId', 'in', following),
          where('isDraft', '==', false)
        );

        const querySnapshot = await getDocs(q);
        const feedPosts: Post[] = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          feedPosts.push({
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date(),
          } as Post);
        });

        feedPosts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        setPosts(feedPosts);
      } catch (error) {
        console.error('Error fetching feed:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeed();
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center">
        <p className="text-xl mb-4">Please login to see your personalized feed</p>
        <Link href="/login" className="text-purple-600 hover:underline">
          Login
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-4 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
        My Feed
      </h1>

      {posts.length === 0 ? (
        <div className="text-center py-16 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-900 rounded-3xl">
          <div className="text-6xl mb-4">👥</div>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
            Your feed is empty
          </p>
          <p className="text-gray-500 mb-6">
            Follow authors to see their posts here!
          </p>
          <Link
            href="/"
            className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-full"
          >
            Discover Authors
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 bg-gradient-to-br from-violet-00 via-purple-600 to-fuchsia-00">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}