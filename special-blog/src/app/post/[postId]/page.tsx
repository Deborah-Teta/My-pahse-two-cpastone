'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { doc, getDoc, deleteDoc, increment, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../lib/AuthContext';
import { Post } from '../../types';
import Link from 'next/link';
import LikeButton from '../../components/LikeButton';
import Comments from '../../components/comments';
import FollowButton from '../../components/FollowButton';

export default function PostPage() {
  const params = useParams();
  const router = useRouter();
  const postId = params.postId as string;
  const { user } = useAuth();

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postDoc = await getDoc(doc(db, 'posts', postId));
        
        if (postDoc.exists()) {
          const data = postDoc.data();
          setPost({
            id: postDoc.id,
            ...data,
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date(),
          } as Post);

          // Increment view count
          await updateDoc(doc(db, 'posts', postId), {
            views: increment(1)
          });
        } else {
          setError('Post not found');
        }
      } catch (err: any) {
        setError('Failed to load post');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'posts', postId));
      alert('Post deleted successfully!');
      router.push('/');
    } catch (err) {
      alert('Failed to delete post');
      console.error(err);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="text-center">Loading post...</div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="text-center text-red-600">{error || 'Post not found'}</div>
        <div className="text-center mt-4">
          <Link href="/" className="text-blue-600 hover:underline">
            Go back home
          </Link>
        </div>
      </div>
    );
  }

  const isAuthor = user?.uid === post.authorId;

  return (
    <article className="max-w-3xl mx-auto px-4 py-16">
      {/* Draft Badge */}
      {post.isDraft && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-2 rounded mb-6">
          📝 This is a draft - only you can see it
        </div>
      )}

      {/* Title */}
      <h1 className="text-5xl font-bold mb-6">{post.title}</h1>

      {/* Author & Meta Info */}
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-200">
        <div className="flex items-center gap-4">
          <Link href={`/profile/${post.authorId}`}>
            {post.authorPhoto ? (
              <img
                src={post.authorPhoto}
                alt={post.authorName}
                className="w-12 h-12 rounded-full object-cover cursor-pointer hover:opacity-80"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-lg font-bold text-white cursor-pointer hover:opacity-80">
                {post.authorName.charAt(0).toUpperCase()}
              </div>
            )}
          </Link>
          <div className="flex-1">
            <Link href={`/profile/${post.authorId}`}>
              <p className="font-medium hover:underline">{post.authorName}</p>
            </Link>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>{formatDate(post.createdAt)}</span>
              <span>·</span>
              <span>{calculateReadTime(post.content)}</span>
            </div>
          </div>
          {!isAuthor && user && (
            <FollowButton authorId={post.authorId} size="small" />
          )}
        </div>

        {/* Edit/Delete buttons (only for author) */}
        {isAuthor && (
          <div className="flex gap-2">
            <Link
              href={`/post/${postId}/edit`}
              className="px-4 py-2 border border-gray-300 rounded-full hover:bg-gray-50"
            >
              Edit
            </Link>
            <button
              onClick={handleDelete}
              className="px-4 py-2 border border-red-300 text-red-600 rounded-full hover:bg-red-50"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Cover Image */}
      {post.coverImage && (
        <div className="mb-8">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-96 object-cover rounded-lg"
          />
        </div>
      )}

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          {post.tags.map((tag, index) => (
            <Link
              key={index}
              href={`/tag/${tag}`}
              className="bg-gray-700 text-white px-3 py-1 rounded-full text-sm hover:bg-gray-900"
            >
              #{tag}
            </Link>
          ))}
        </div>
      )}

      {/* Post Content */}
      <div
        className="prose prose-lg max-w-none mb-12"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* Like Button & Stats */}
      <div className="flex items-center gap-6 py-6 border-t border-b border-gray-200">
        <LikeButton 
          postId={postId} 
          initialLikes={post.likes} 
          likedBy={post.likedBy}
        />
        <div className="flex items-center gap-2 text-gray-200">
          <span className="text-2xl">👁️</span>
          <span>{post.views} views</span>
        </div>
      </div>

      {/* Comments Section */}
      <Comments postId={postId} />

      {/* Back to home */}
      <div className="mt-12 pt-8 border-t border-gray-200">
        <Link href="/" className="text-blue-600 hover:underline">
          ← Back to all posts
        </Link>
      </div>
    </article>
  );
}