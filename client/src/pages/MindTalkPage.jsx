import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { getAllPosts, createPost, addReaction, addComment } from '@/services/mindtalk.service';
import { toast } from 'sonner';
import { MessageCircle } from 'lucide-react';
import PostCard from '@/components/mindtalk/PostCard';
import PostForm from '@/components/mindtalk/PostForm';
import { useMindTalkSocket } from '@/hooks/useMindTalkSocket';

export default function MindTalkPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Stable callbacks for socket
  const handleNewPost = useCallback((newPost) => {
    setPosts((prevPosts) => [newPost, ...prevPosts]);
  }, []);

  const handlePostUpdated = useCallback((updatedPost) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post._id === updatedPost._id ? updatedPost : post
      )
    );
  }, []);

  // Load posts on mount
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/room');
      return;
    }
    loadPosts();
  }, [isAuthenticated, navigate]);

  // Initialize socket connection
  useMindTalkSocket(handleNewPost, handlePostUpdated);

  const loadPosts = async () => {
    try {
      const data = await getAllPosts();
      setPosts(data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading posts:', error);
      toast.error('Failed to load posts');
      setLoading(false);
    }
  };

  const handleCreatePost = async (postData) => {
    try {
      await createPost(postData);
      // Socket.io will handle the real-time update
      toast.success('Post created successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error creating post');
      throw error;
    }
  };

  const handleAddReaction = async (postId, type = 'like') => {
    try {
      await addReaction(postId, type);
      // Socket.io will handle the real-time update
    } catch (error) {
      toast.error('Error adding reaction');
      throw error;
    }
  };

  const handleAddComment = async (postId, commentText) => {
    try {
      await addComment(postId, commentText);
      toast.success('Comment added');
      // Socket.io will handle the real-time update
    } catch (error) {
      toast.error('Error adding comment');
      throw error;
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">MindTalk Room</h1>
            <p className="text-muted-foreground">
              Share your thoughts anonymously in a safe space
            </p>
          </div>
          <PostForm onCreatePost={handleCreatePost} />
        </div>
        <PostForm onCreatePost={handleCreatePost} />

        <div className="space-y-4">
          {posts.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No posts yet. Be the first to share!</p>
              </CardContent>
            </Card>
          ) : (
            posts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                onReaction={handleAddReaction}
                onComment={handleAddComment}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
