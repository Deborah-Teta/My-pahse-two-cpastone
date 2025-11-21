'use client';

import { useParams } from 'next/navigation';
import { useAuth } from '../../lib/AuthContext';
import { useUser } from '../../hooks/useUser';
import Link from 'next/link';

export default function ProfilePage() {
  const params = useParams();
  const userId = params.userId as string;
  
  const { user: currentUser } = useAuth(); // The logged-in user
  const { user: profileUser, loading, error } = useUser(userId); // The profile we're viewing

  // Check if viewing own profile
  const isOwnProfile = currentUser?.uid === userId;

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center">Loading profile...</div>
      </div>
    );
  }

  if (error || !profileUser) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center text-red-600">
          {error || 'User not found'}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      {/* Profile Header */}
      <div className="flex items-start gap-8 mb-12 pb-8 border-b border-gray-200">
        {/* Avatar */}
        <div className="flex-shrink-0">
          {profileUser.photoURL ? (
            <img
              src={profileUser.photoURL}
              alt={profileUser.displayName}
              className="w-24 h-24 rounded-full object-cover"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-3xl font-bold text-white">
              {profileUser.displayName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* User Info */}
        <div className="flex-1">
          <h1 className="text-4xl font-bold mb-2">{profileUser.displayName}</h1>
          <p className="text-gray-600 mb-4">{profileUser.email}</p>
          
          {profileUser.bio && (
            <p className="text-gray-700 mb-4">{profileUser.bio}</p>
          )}

          {isOwnProfile && (
            <Link
              href="/profile/edit"
              className="inline-block bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800"
            >
              Edit Profile
            </Link>
          )}
        </div>
      </div>

      {/* User's Posts Section */}
      <div>
        <h2 className="text-2xl font-bold mb-6">
          {isOwnProfile ? 'Your Posts' : `Posts by ${profileUser.displayName}`}
        </h2>

        {/* Placeholder for posts - we'll add real posts later */}
        <div className="space-y-6">
          {[1, 2, 3].map((item) => (
            <div key={item} className="border-b border-gray-200 pb-6">
              <h3 className="text-xl font-bold mb-2 hover:underline cursor-pointer">
                Sample Post Title {item}
              </h3>
              <p className="text-gray-600 mb-3">
                This is a preview of a blog post. We'll load real posts here soon...
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>5 min read</span>
                <span>·</span>
                <span>Oct 15, 2024</span>
                <span>·</span>
                <span>👏 24 claps</span>
              </div>
            </div>
          ))}
        </div>

        {isOwnProfile && (
          <div className="text-center mt-12">
            <Link
              href="/write"
              className="inline-block bg-black text-white px-8 py-3 rounded-full hover:bg-gray-800"
            >
              Write a new post
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}