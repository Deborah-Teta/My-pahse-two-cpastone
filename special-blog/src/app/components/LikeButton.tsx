'use client';

import { useLike } from '../hooks/useLike';

interface LikeButtonProps {
  postId: string;
  initialLikes: number;
  likedBy?: string[];
  size?: 'small' | 'large';
}

export default function LikeButton({ 
  postId, 
  initialLikes, 
  likedBy = [],
  size = 'large'
}: LikeButtonProps) {
  const { likes, isLiked, toggleLike, isLoading } = useLike(postId, initialLikes, likedBy);

  const sizeClasses = size === 'small' 
    ? 'px-3 py-1 text-sm' 
    : 'px-6 py-3 text-lg';

  return (
    <button
      onClick={toggleLike}
      disabled={isLoading}
      className={`${sizeClasses} flex items-center gap-2 border rounded-full transition ${
        isLiked 
          ? 'bg-green-50 border-green-500 text-green-700' 
          : 'border-gray-300 hover:bg-gray-50'
      } disabled:opacity-50`}
    >
      <span className={size === 'large' ? 'text-2xl' : 'text-lg'}>
        {isLiked ? '👏' : '👏'}
      </span>
      <span>{likes}</span>
    </button>
  );
}