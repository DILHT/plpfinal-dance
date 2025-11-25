import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, MessageCircle } from 'lucide-react';
import { format } from 'date-fns';
import CommentDialog from './CommentDialog';

const categoryColors = {
  anxiety: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  depression: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  stress: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  motivation: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  gratitude: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  general: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
};

export default function PostCard({ post, onReaction, onComment }) {
  const [isReacting, setIsReacting] = useState(false);
  const [reactionCount, setReactionCount] = useState(post.reactions?.length || 0);

  // Update reaction count when post updates from socket
  useEffect(() => {
    setReactionCount(post.reactions?.length || 0);
  }, [post.reactions]);

  const handleReactionClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('Heart clicked for post:', post._id);
    
    if (isReacting) return;
    
    // Optimistic update
    setReactionCount(prev => prev + 1);
    setIsReacting(true);
    
    try {
      await onReaction(post._id, 'like');
      console.log('Reaction added successfully');
    } catch (error) {
      console.error('Error adding reaction:', error);
      // Revert optimistic update on error
      setReactionCount(prev => Math.max(0, prev - 1));
    } finally {
      setIsReacting(false);
    }
  };

  return (
    <Card className="w-full hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <Badge className={categoryColors[post.category] || categoryColors.general}>
                {post.category}
              </Badge>
              {post.anonymous ? (
                <Badge variant="outline">Anonymous</Badge>
              ) : post.author && (
                <Badge variant="outline">{post.author.name || 'User'}</Badge>
              )}
            </div>
            <CardDescription className="text-xs">
              {format(new Date(post.createdAt), 'PPp')}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="whitespace-pre-wrap mb-4 text-base leading-relaxed">{post.text}</p>
        <div className="flex items-center gap-4 pt-2 border-t">
          {/* Heart/Reaction Button - Native HTML button with large hit area */}
          <button
            type="button"
            onClick={handleReactionClick}
            disabled={isReacting}
            className="flex items-center gap-2 min-w-[80px] min-h-[40px] px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            aria-label={`React to post (${reactionCount} reactions)`}
          >
            <Heart 
              className={`h-5 w-5 transition-colors ${
                isReacting ? 'text-red-500 animate-pulse' : 'text-gray-600 dark:text-gray-400'
              }`} 
            />
            <span className="font-medium text-sm">{reactionCount}</span>
          </button>
          
          {/* Comment Button - Passed to CommentDialog */}
          <CommentDialog post={post} onComment={onComment} />
        </div>
      </CardContent>
    </Card>
  );
}
