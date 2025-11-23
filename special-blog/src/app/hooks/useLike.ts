'use client';

import { useState, useEffect } from 'react';
import { doc, updateDoc, arrayUnion, arrayRemove, increment } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../lib/AuthContext';

export function useLike(postId: string, initialLikes: number, initialLikedBy: string[] = []) {
  const { user } = useAuth();
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user && initialLikedBy.includes(user.uid)) {
      setIsLiked(true);
    }
  }, [user, initialLikedBy]);

  const toggleLike = async () => {
    if (!user) {
      alert('Please login to like posts');
      return;
    }

    setIsLoading(true);

    try {
      const postRef = doc(db, 'posts', postId);

      if (isLiked) {
        // Unlike
        await updateDoc(postRef, {
          likes: increment(-1),
          likedBy: arrayRemove(user.uid)
        });
        setLikes(prev => prev - 1);
        setIsLiked(false);
      } else {
        // Like
        await updateDoc(postRef, {
          likes: increment(1),
          likedBy: arrayUnion(user.uid)
        });
        setLikes(prev => prev + 1);
        setIsLiked(true);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      alert('Failed to update like');
    } finally {
      setIsLoading(false);
    }
  };

  return { likes, isLiked, toggleLike, isLoading };
}