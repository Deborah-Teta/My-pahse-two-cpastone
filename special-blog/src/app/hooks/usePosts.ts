'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, getDocs, DocumentData } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Post } from '../types';

export function usePosts(authorId?: string, includeDrafts: boolean = false) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        
        let q;
        
        if (authorId) {
          // Fetch posts by specific author (without compound index)
          q = query(
            collection(db, 'posts'),
            where('authorId', '==', authorId)
          );
        } else {
          // Fetch all published posts (for home page)
          q = query(
            collection(db, 'posts'),
            where('isDraft', '==', false)
          );
        }

        const querySnapshot = await getDocs(q);
        const postsData: Post[] = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          postsData.push({
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date(),
          } as Post);
        });

        // Sort in memory instead of in the query
        postsData.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

        // Filter drafts if needed
        const filteredPosts = includeDrafts 
          ? postsData 
          : postsData.filter(post => !post.isDraft);

        setPosts(filteredPosts);
      } catch (err: any) {
        console.error('Error fetching posts:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [authorId, includeDrafts]);

  return { posts, loading, error };
}