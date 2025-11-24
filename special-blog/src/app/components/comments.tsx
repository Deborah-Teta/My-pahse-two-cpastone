'use client';

import { useState, useEffect } from 'react';
import { collection, addDoc, query, where, orderBy, getDocs, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../lib/AuthContext';
import { Comment } from '../types';
import Link from 'next/link';

interface CommentsProps {
  postId: string;
}

export default function Comments({ postId }: CommentsProps) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [replyTo, setReplyTo] = useState<string | null>(null);


  useEffect(() => {
    const fetchComments = async () => {
      try {
        const q = query(
          collection(db, 'comments'),
          where('postId', '==', postId)
        );

        const querySnapshot = await getDocs(q);
        const commentsData: Comment[] = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          commentsData.push({
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate() || new Date(),
          } as Comment);
        });

        
        commentsData.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
        setComments(commentsData);
      } catch (error) {
        console.error('Error fetching comments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      alert('Please login to comment');
      return;
    }

    if (!newComment.trim()) {
      return;
    }

    setSubmitting(true);

    try {
      const commentData = {
        postId,
        authorId: user.uid,
        authorName: user.displayName,
        authorPhoto: user.photoURL || '',
        content: newComment.trim(),
        createdAt: serverTimestamp(),
        likes: 0,
        likedBy: [],
        ...(replyTo && { parentId: replyTo })
      };

      const docRef = await addDoc(collection(db, 'comments'), commentData);

      // Add to local state
      const newCommentObj: Comment = {
        id: docRef.id,
        ...commentData,
        createdAt: new Date(),
      } as Comment;

      setComments(prev => [...prev, newCommentObj]);
      setNewComment('');
      setReplyTo(null);
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Failed to post comment');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  // Organize comments into threads
  const topLevelComments = comments.filter(c => !c.parentId);
  const getReplies = (parentId: string) => comments.filter(c => c.parentId === parentId);

  const CommentItem = ({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) => (
    <div className={`${isReply ? 'ml-12 mt-4' : 'mb-6'}`}>
      <div className="flex gap-3">
        {/* Avatar */}
        <Link href={`/profile/${comment.authorId}`}>
          {comment.authorPhoto ? (
            <img
              src={comment.authorPhoto}
              alt={comment.authorName}
              className="w-10 h-10 rounded-full object-cover cursor-pointer hover:opacity-80"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center font-bold text-white cursor-pointer hover:opacity-80">
              {comment.authorName.charAt(0).toUpperCase()}
            </div>
          )}
        </Link>

        {/* Comment Content */}
        <div className="flex-1">
          <div className="bg-gradient-to-br from-violet-00 via-purple-600 to-fuchsia-00 rounded-lg px-4 py-3">
            <Link href={`/profile/${comment.authorId}`}>
              <p className="font-medium text-sm mb-1 hover:underline">{comment.authorName}</p>
            </Link>
            <p className="text-gray-200">{comment.content}</p>
          </div>
          
          {/* Comment Actions */}
          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
            <span>{formatDate(comment.createdAt)}</span>
            <button
              onClick={() => setReplyTo(comment.id)}
              className="hover:text-gray-800"
            >
              Reply
            </button>
          </div>

          {/* Reply Form */}
          {replyTo === comment.id && (
            <div className="mt-3">
              <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder={`Reply to ${comment.authorName}...`}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-black"
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={submitting || !newComment.trim()}
                  className="px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800 disabled:bg-gray-400"
                >
                  Reply
                </button>
                <button
                  type="button"
                  onClick={() => setReplyTo(null)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
              </form>
            </div>
          )}

          {/* Nested Replies */}
          {getReplies(comment.id).map(reply => (
            <CommentItem key={reply.id} comment={reply} isReply />
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="mt-12 pt-8 border-t border-gray-200">
      <h3 className="text-2xl font-bold mb-6">
        Comments ({comments.length})
      </h3>

      {/* Comment Form */}
      {user ? (
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex gap-3">
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-500 flex items-center justify-center font-bold text-white">
                {user.displayName.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="flex-1">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-black"
              />
            </div>
            <button
              type="submit"
              disabled={submitting || !newComment.trim()}
              className="px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800 "
            >
              {submitting ? 'Posting...' : 'Post'}
            </button>
          </div>
        </form>
      ) : (
        <div className="mb-8 p-6 bg-gray-500 rounded-lg text-center">
          <p className="text-gray-600 mb-3">Sign in to join the conversation</p>
          <Link
            href="/login"
            className="inline-block px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800"
          >
            Sign In
          </Link>
        </div>
      )}

      {/* Comments List */}
      {loading ? (
        <div className="text-center py-8 text-gray-600">Loading comments...</div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8 text-gray-600">
          No comments yet. Be the first to comment!
        </div>
      ) : (
        <div>
          {topLevelComments.map(comment => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
        </div>
      )}
    </div>
  );
}