'use client';

import { useParams } from 'next/navigation';
import { useAuth } from '../../lib/AuthContext';
import { useUser } from '../../hooks/useUser';
import { usePosts } from '../../hooks/usePosts';
import Link from 'next/link';
import PostCard from '../../components/PostCard';

export default function ProfilePage() {
  const params = useParams();
  const userId = params.userId as string;
  
  const { user: currentUser } = useAuth();
  const { user: profileUser, loading: userLoading, error: userError } = useUser(userId);
  
  // Fetch user's posts (include drafts if viewing own profile)
  const isOwnProfile = currentUser?.uid === userId;
  const { posts, loading: postsLoading } = usePosts(userId, isOwnProfile);

  if (userLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center">Loading profile...</div>
      </div>
    );
  }

  if (userError || !profileUser) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center text-red-600">
          {userError || 'User not found'}
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
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">
            {isOwnProfile ? 'Your Posts' : `Posts by ${profileUser.displayName}`}
          </h2>
          {isOwnProfile && (
            <Link
              href="/write"
              className="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800"
            >
              Write new post
            </Link>
          )}
        </div>

        {postsLoading ? (
          <div className="text-center py-8">Loading posts...</div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16 border border-gray-200 rounded-lg">
            <p className="text-xl text-gray-600 mb-4">
              {isOwnProfile ? "You haven't written any posts yet." : "This user hasn't written any posts yet."}
            </p>
            {isOwnProfile && (
              <Link
                href="/write"
                className="inline-block bg-black text-white px-8 py-3 rounded-full hover:bg-gray-800"
              >
                Write your first post
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}