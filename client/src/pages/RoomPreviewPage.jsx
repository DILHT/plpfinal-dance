import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getAllPosts, createPost, addReaction, addComment } from '@/services/mindtalk.service';
import { useAuth } from '@/hooks/useAuth';
import { Heart, MessageCircle, Sparkles } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import PostForm from '@/components/mindtalk/PostForm';
import CommentDialog from '@/components/mindtalk/CommentDialog';

// Isolated Reaction Button Component to fix animation bug
function ReactionButton({ post, hasReacted, onReaction, isAuthenticated, isPending, reactionCount }) {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated || isPending || isAnimating) return;
    
    // Trigger animation for THIS button only
    setIsAnimating(true);
    onReaction();
    
    // Remove animation after 300ms
    setTimeout(() => setIsAnimating(false), 300);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={!isAuthenticated || isPending}
      className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-50 dark:hover:bg-red-950/20"
      data-post-id={post._id}
    >
      <Heart 
        className={`h-5 w-5 transition-all duration-200 ${
          hasReacted 
            ? 'fill-rose-500 text-rose-500' 
            : 'text-gray-600 dark:text-slate-400 hover:text-rose-500'
        } ${
          isAnimating ? 'animate-heart-pop' : ''
        }`}
      />
      <span className={`font-medium transition-colors ${
        hasReacted
          ? 'text-rose-500'
          : 'text-gray-600 dark:text-slate-400'
      }`}>
        {reactionCount}
      </span>
    </button>
  );
}

export default function RoomPreviewPage() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const queryClient = useQueryClient();
  const [reactingPostId, setReactingPostId] = useState(null);
  const { data: posts, isLoading } = useQuery({
    queryKey: ['mindtalk-posts'],
    queryFn: getAllPosts,
  });

  // Mutation for creating posts
  const createPostMutation = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mindtalk-posts'] });
      toast.success('Post created successfully!');
    },
    onError: (error) => {
      console.error('Error creating post:', error);
      toast.error(error.response?.data?.message || 'Failed to create post. Please try again.');
    },
  });

  // Mutation for adding reactions
  const addReactionMutation = useMutation({
    mutationFn: ({ postId, type }) => addReaction(postId, type),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mindtalk-posts'] });
      setReactingPostId(null);
    },
    onError: (error) => {
      console.error('Error adding reaction:', error);
      toast.error(error.response?.data?.message || 'Failed to add reaction. Please try again.');
      setReactingPostId(null);
    },
  });

  // Mutation for adding comments
  const addCommentMutation = useMutation({
    mutationFn: ({ postId, text }) => addComment(postId, text),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mindtalk-posts'] });
      toast.success('Comment added successfully!');
    },
    onError: (error) => {
      console.error('Error adding comment:', error);
      toast.error(error.response?.data?.message || 'Failed to add comment. Please try again.');
      throw error;
    },
  });

  // Handler for creating posts
  const handleCreatePost = async (postData) => {
    if (!isAuthenticated) {
      toast.error('Please log in to create a post');
      navigate('/login');
      return;
    }
    return createPostMutation.mutateAsync(postData);
  };

  // Handler for adding reactions
  const handleAddReaction = (postId) => {
    if (!isAuthenticated) {
      toast.error('Please log in to react to posts');
      navigate('/login');
      return;
    }
    setReactingPostId(postId);
    addReactionMutation.mutate({ postId, type: 'like' });
  };

  // Handler for adding comments
  const handleAddComment = async (postId, text) => {
    if (!isAuthenticated) {
      toast.error('Please log in to comment on posts');
      navigate('/login');
      return;
    }
    return addCommentMutation.mutateAsync({ postId, text });
  };

  // Helper function to check if current user has reacted to a post
  const hasUserReacted = (post) => {
    if (!user || !post.reactions || post.reactions.length === 0) return false;
    
    const userId = user._id || user.id;
    if (!userId) return false;
    
    return post.reactions.some((reaction) => {
      const reactionUserId = reaction.user?._id || reaction.user?.id || reaction.user;
      return String(reactionUserId) === String(userId);
    });
  };

  // Get category color with high contrast for both themes
  const getCategoryColor = (category) => {
    const colors = {
      general: 'bg-blue-500 text-white dark:bg-blue-600 dark:text-white border-blue-600 dark:border-blue-500',
      anxiety: 'bg-red-500 text-white dark:bg-red-600 dark:text-white border-red-600 dark:border-red-500',
      depression: 'bg-purple-500 text-white dark:bg-purple-600 dark:text-white border-purple-600 dark:border-purple-500',
      stress: 'bg-orange-500 text-white dark:bg-orange-600 dark:text-white border-orange-600 dark:border-orange-500',
      motivation: 'bg-green-500 text-white dark:bg-green-600 dark:text-white border-green-600 dark:border-green-500',
      gratitude: 'bg-yellow-500 text-gray-900 dark:bg-yellow-600 dark:text-gray-900 border-yellow-600 dark:border-yellow-500',
    };
    return colors[category] || colors.general;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center text-gray-600 dark:text-slate-400">Loading posts...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-purple-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="mb-8 md:mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-slate-100">
                MindTalk Room
              </h1>
            </div>
            <p className="text-gray-600 dark:text-slate-400 text-base md:text-lg mb-6 leading-relaxed">
              A safe space for anonymous sharing. View posts below. To post, react, or comment, please log in as an approved member.
            </p>
            {!isAuthenticated && (
              <Button 
                onClick={() => navigate('/login')}
                className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Login to Participate
              </Button>
            )}
          </div>
          
          <PostForm onCreatePost={handleCreatePost} />

          {/* Posts Section */}
          <div className="space-y-6">
            {posts && posts.length > 0 ? (
              posts.map((post) => (
                <Card 
                  key={post._id}
                  className="group hover:shadow-lg dark:hover:shadow-xl transition-all duration-300 border-2 border-gray-200 dark:border-slate-700 hover:border-primary/40 dark:hover:border-primary/50 bg-white dark:bg-slate-800 shadow-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between flex-wrap gap-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge 
                          className={`${getCategoryColor(post.category)} border font-medium px-3 py-1`}
                        >
                          {post.category.charAt(0).toUpperCase() + post.category.slice(1)}
                        </Badge>
                        {post.anonymous && (
                          <Badge 
                            variant="secondary" 
                            className="bg-gray-100 dark:bg-slate-700 border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-300 font-medium px-3 py-1"
                          >
                            Anonymous
                          </Badge>
                        )}
                      </div>
                      <span className="text-xs md:text-sm text-gray-500 dark:text-slate-400 font-medium">
                        {format(new Date(post.createdAt), 'MMM d, yyyy')}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="mb-6 whitespace-pre-wrap text-gray-900 dark:text-slate-100 leading-relaxed text-base">
                      {post.text}
                    </p>
                    <div className="flex items-center gap-6 pt-4 border-t border-gray-200 dark:border-slate-700">
                      <ReactionButton
                        post={post}
                        hasReacted={hasUserReacted(post)}
                        onReaction={() => handleAddReaction(post._id)}
                        isAuthenticated={isAuthenticated}
                        isPending={addReactionMutation.isPending}
                        reactionCount={post.reactions?.length || 0}
                      />
                      <CommentDialog key={`comment-${post._id}`} post={post} onComment={handleAddComment} />
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="border-2 border-dashed border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800">
                <CardContent className="py-16 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="p-4 rounded-full bg-gray-100 dark:bg-slate-700">
                      <MessageCircle className="h-8 w-8 text-gray-500 dark:text-slate-400" />
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-2">No posts yet</p>
                      <p className="text-sm text-gray-600 dark:text-slate-400">Be the first to share your thoughts!</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
