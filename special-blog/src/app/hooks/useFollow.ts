'use client';

import { useState, useEffect } from 'react';
import { doc, updateDoc, arrayUnion, arrayRemove, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../lib/AuthContext';

export function useFollow(authorId: string) {
  const { user } = useAuth();
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkFollowStatus = async () => {
      if (!user || !authorId) return;

      try {
        const authorDoc = await getDoc(doc(db, 'users', authorId));
        if (authorDoc.exists()) {
          const followers = authorDoc.data().followers || [];
          setFollowersCount(followers.length);
          setIsFollowing(followers.includes(user.uid));
        }
      } catch (error) {
        console.error('Error checking follow status:', error);
      }
    };

    checkFollowStatus();
  }, [user, authorId]);

  const toggleFollow = async () => {
    if (!user) {
      alert('Please login to follow authors');
      return;
    }

    if (user.uid === authorId) {
      alert('You cannot follow yourself');
      return;
    }

    setLoading(true);

    try {
      const authorRef = doc(db, 'users', authorId);
      const currentUserRef = doc(db, 'users', user.uid);

      if (isFollowing) {
        
        await updateDoc(authorRef, {
          followers: arrayRemove(user.uid)
        });
        await updateDoc(currentUserRef, {
          following: arrayRemove(authorId)
        });
        setFollowersCount(prev => prev - 1);
        setIsFollowing(false);
      } else {
        // Follow
        await updateDoc(authorRef, {
          followers: arrayUnion(user.uid)
        });
        await updateDoc(currentUserRef, {
          following: arrayUnion(authorId)
        });
        setFollowersCount(prev => prev + 1);
        setIsFollowing(true);
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
      alert('Failed to update follow status');
    } finally {
      setLoading(false);
    }
  };

  return { isFollowing, followersCount, toggleFollow, loading };
}