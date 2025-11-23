'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../lib/AuthContext';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import TextEditor from '../components/TextEditor';

export default function WritePage() {
  const { user } = useAuth();
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  // Load draft from localStorage
  useEffect(() => {
    const savedDraft = localStorage.getItem('draft');
    if (savedDraft) {
      const draft = JSON.parse(savedDraft);
      setTitle(draft.title || '');
      setContent(draft.content || '');
      setTags(draft.tags || '');
      setCoverImage(draft.coverImage || '');
    }
  }, []);

  // Auto-save draft to localStorage
  useEffect(() => {
    const timer = setTimeout(() => {
      if (title || content) {
        const draft = { title, content, tags, coverImage, lastSaved: new Date() };
        localStorage.setItem('draft', JSON.stringify(draft));
      }
    }, 2000); // Save after 2 seconds of no typing

    return () => clearTimeout(timer);
  }, [title, content, tags, coverImage]);

  // Save as draft
  const handleSaveDraft = async () => {
    if (!user || !title) {
      setError('Please add a title');
      return;
    }

    try {
      setLoading(true);
      setError('');

      await addDoc(collection(db, 'posts'), {
        title,
        content,
        authorId: user.uid,
        authorName: user.displayName,
        authorPhoto: user.photoURL || '',
        coverImage,
        tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        isDraft: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        likes: 0,
        views: 0,
      });

      // Clear local draft
      localStorage.removeItem('draft');
      
      alert('Draft saved successfully!');
      router.push(`/profile/${user.uid}`);
    } catch (err: any) {
      setError('Failed to save draft');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Publish post
  const handlePublish = async () => {
    if (!user || !title || !content) {
      setError('Please add both title and content');
      return;
    }

    try {
      setLoading(true);
      setError('');

      await addDoc(collection(db, 'posts'), {
        title,
        content,
        authorId: user.uid,
        authorName: user.displayName,
        authorPhoto: user.photoURL || '',
        coverImage,
        tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        isDraft: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        likes: 0,
        views: 0,
      });

      // Clear local draft
      localStorage.removeItem('draft');
      
      alert('Post published successfully!');
      router.push('/');
    } catch (err: any) {
      setError('Failed to publish post');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div className="max-w-4xl mx-auto px-4 py-16">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Write a Story</h1>
        <div className="flex gap-4">
          <button
            onClick={handleSaveDraft}
            disabled={loading}
            className="px-6 py-2 border border-gray-300 rounded-full hover:bg-gray-50 disabled:bg-gray-100"
          >
            Save Draft
          </button>
          <button
            onClick={handlePublish}
            disabled={loading}
            className="px-6 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 disabled:bg-gray-400"
          >
            {loading ? 'Publishing...' : 'Publish'}
          </button>
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
        className="w-full text-4xl font-bold mb-6 focus:outline-none placeholder-gray-500"
      />

      {/* Cover Image URL (optional) */}
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
      <div className="mb-6 bg-gradient-to-br from-violet-00 via-purple-600 to-fuchsia-00">
        <TextEditor content={content} onChange={setContent} />
      </div>

      {/* Tags Input */}
      <input
        type="text"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        placeholder="Tags (separate with commas, e.g., javascript, react, webdev)"
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black mt-6"
      />

      <p className="text-sm text-gray-500 mt-2">
        💾 Draft auto-saves every 2 seconds
      </p>
    </div>
  );
}