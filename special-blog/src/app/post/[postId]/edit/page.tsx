'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '../../../lib/AuthContext';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import TextEditor from '../../../components/TextEditor';

export default function EditPostPage() {
  const params = useParams();
  const router = useRouter();
  const postId = params.postId as string;
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [isDraft, setIsDraft] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Fetch post data
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postDoc = await getDoc(doc(db, 'posts', postId));
        
        if (postDoc.exists()) {
          const data = postDoc.data();
          
          // Check if user is the author
          if (data.authorId !== user?.uid) {
            setError('You are not authorized to edit this post');
            return;
          }

          setTitle(data.title || '');
          setContent(data.content || '');
          setTags(data.tags?.join(', ') || '');
          setCoverImage(data.coverImage || '');
          setIsDraft(data.isDraft || false);
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

    if (user) {
      fetchPost();
    } else {
      router.push('/login');
    }
  }, [postId, user, router]);

  const handleUpdate = async (publishNow: boolean = false) => {
    if (!title || !content) {
      setError('Please add both title and content');
      return;
    }

    try {
      setSaving(true);
      setError('');

      await updateDoc(doc(db, 'posts', postId), {
        title,
        content,
        coverImage,
        tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        isDraft: publishNow ? false : isDraft,
        updatedAt: serverTimestamp(),
      });

      alert('Post updated successfully!');
      router.push(`/post/${postId}`);
    } catch (err: any) {
      setError('Failed to update post');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (error && !title) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Edit Post</h1>
        <div className="flex gap-4">
          <button
            onClick={() => router.back()}
            className="px-6 py-2 border border-gray-300 rounded-full hover:bg-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={() => handleUpdate(false)}
            disabled={saving}
            className="px-6 py-2 border border-gray-300 rounded-full hover:bg-gray-50 disabled:bg-gray-100"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
          {isDraft && (
            <button
              onClick={() => handleUpdate(true)}
              disabled={saving}
              className="px-6 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 disabled:bg-gray-400"
            >
              Publish
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Title Input */}
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        className="w-full text-4xl font-bold mb-6 focus:outline-none placeholder-gray-300"
      />

      {/* Cover Image URL */}
      <input
        type="text"
        value={coverImage}
        onChange={(e) => setCoverImage(e.target.value)}
        placeholder="Cover image URL (optional)"
        className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-black"
      />

      {coverImage && (
        <div className="mb-4">
          <img src={coverImage} alt="Cover" className="w-full h-64 object-cover rounded-lg" />
        </div>
      )}

      {/* Rich Text Editor */}
      <div className="mb-6">
        <TextEditor content={content} onChange={setContent} />
      </div>

      {/* Tags Input */}
      <input
        type="text"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        placeholder="Tags (separate with commas)"
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
      />
    </div>
  );
}