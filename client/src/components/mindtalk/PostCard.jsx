import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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

  const handleReactionClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isReacting) return;
    setIsReacting(true);
    try {
      await onReaction(post._id, 'like');
    } catch (error) {
      console.error('Error adding reaction:', error);
    } finally {
      setIsReacting(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
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
        <p className="whitespace-pre-wrap mb-4">{post.text}</p>
        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleReactionClick}
            disabled={isReacting}
            className="cursor-pointer hover:bg-accent flex items-center gap-1"
            style={{ pointerEvents: 'auto' }}
          >
            <Heart className="h-4 w-4" />
            <span>{post.reactions?.length || 0}</span>
          </Button>
          <CommentDialog post={post} onComment={onComment} />
        </div>
      </CardContent>
    </Card>
  );
}

