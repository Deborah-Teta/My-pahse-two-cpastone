'use client';

import { useFollow } from '../hooks/useFollow';

interface FollowButtonProps {
  authorId: string;
  size?: 'small' | 'medium' | 'large';
}

export default function FollowButton({ authorId, size = 'medium' }: FollowButtonProps) {
  const { isFollowing, followersCount, toggleFollow, loading } = useFollow(authorId);

  const sizeClasses = {
    small: 'px-4 py-1 text-sm',
    medium: 'px-6 py-2 text-base',
    large: 'px-8 py-3 text-lg'
  };

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={toggleFollow}
        disabled={loading}
        className={`${sizeClasses[size]} rounded-full font-medium transition-all disabled:opacity-50 ${
          isFollowing
            ? 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
            : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl'
        }`}
      >
        {loading ? 'Loading...' : isFollowing ? 'Following' : 'Follow'}
      </button>
      
      <span className="text-sm text-gray-600 dark:text-gray-400">
        {followersCount} {followersCount === 1 ? 'follower' : 'followers'}
      </span>
    </div>
  );
}