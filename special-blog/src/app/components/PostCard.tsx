import Link from 'next/link';
import { Post } from '../types';

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  // Extract plain text from HTML content for preview
  const getTextPreview = (html: string, maxLength: number = 150) => {
    const text = html.replace(/<[^>]*>/g, ''); // Remove HTML tags
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  // Format date
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Calculate reading time (rough estimate)
  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
  };

  return (
    <Link href={`/post/${post.id}`}>
      <div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition cursor-pointer">
        {/* Cover Image */}
        {post.coverImage && (
          <div className="h-48 mb-4 overflow-hidden rounded-lg">
            <img 
              src={post.coverImage} 
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Author Info */}
        <div className="flex items-center gap-2 mb-3">
          {post.authorPhoto ? (
            <img 
              src={post.authorPhoto} 
              alt={post.authorName}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-sm font-bold text-white">
              {post.authorName.charAt(0).toUpperCase()}
            </div>
          )}
          <span className="text-sm text-gray-600">{post.authorName}</span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold mb-2 hover:underline">
          {post.title}
        </h3>

        {/* Content Preview */}
        <p className="text-gray-600 mb-4">
          {getTextPreview(post.content)}
        </p>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {post.tags.slice(0, 3).map((tag, index) => (
              <span 
                key={index}
                className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Meta Info */}
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span>{formatDate(post.createdAt)}</span>
          <span>·</span>
          <span>{calculateReadTime(post.content)}</span>
          <span>·</span>
          <span>👏 {post.likes}</span>
          {post.isDraft && (
            <>
              <span>·</span>
              <span className="text-yellow-600 font-medium">Draft</span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}