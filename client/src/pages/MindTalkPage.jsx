import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { getAllPosts, createPost, addReaction, addComment } from '@/services/mindtalk.service';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Heart, MessageCircle, Plus } from 'lucide-react';

export default function MindTalkPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [postDialogOpen, setPostDialogOpen] = useState(false);
  const [commentDialogOpen, setCommentDialogOpen] = useState(null);
  const [newPost, setNewPost] = useState({ text: '', category: 'general' });
  const [newComment, setNewComment] = useState('');
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/room');
      return;
    }
    loadPosts();
  }, [isAuthenticated, navigate]);

  const loadPosts = async () => {
    try {
      const data = await getAllPosts();
      setPosts(data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading posts:', error);
      setLoading(false);
    }
  };

  const handleCreatePost = async () => {
    if (!newPost.text.trim()) {
      toast.error('Please enter some text');
      return;
    }
    try {
      await createPost(newPost);
      toast.success('Post created successfully');
      setNewPost({ text: '', category: 'general' });
      setPostDialogOpen(false);
      loadPosts();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error creating post');
    }
  };

  const handleAddReaction = async (postId, type = 'like') => {
    try {
      await addReaction(postId, type);
      loadPosts();
    } catch (error) {
      toast.error('Error adding reaction');
    }
  };

  const handleAddComment = async (postId) => {
    if (!newComment.trim()) {
      toast.error('Please enter a comment');
      return;
    }
    try {
      await addComment(postId, newComment);
      toast.success('Comment added');
      setNewComment('');
      setCommentDialogOpen(null);
      loadPosts();
    } catch (error) {
      toast.error('Error adding comment');
    }
  };

  const categoryColors = {
    anxiety: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    depression: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    stress: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    motivation: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    gratitude: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    general: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
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
          <Dialog open={postDialogOpen} onOpenChange={setPostDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Post
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Post</DialogTitle>
                <DialogDescription>
                  Your post will be anonymous. Share what's on your mind.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Category</Label>
                  <Select
                    value={newPost.category}
                    onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                  >
                    <option value="general">General</option>
                    <option value="anxiety">Anxiety</option>
                    <option value="depression">Depression</option>
                    <option value="stress">Stress</option>
                    <option value="motivation">Motivation</option>
                    <option value="gratitude">Gratitude</option>
                  </Select>
                </div>
                <div>
                  <Label>Your Thoughts</Label>
                  <Textarea
                    value={newPost.text}
                    onChange={(e) => setNewPost({ ...newPost, text: e.target.value })}
                    placeholder="Share what's on your mind..."
                    rows={6}
                  />
                </div>
                <Button onClick={handleCreatePost} className="w-full">
                  Post Anonymously
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

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
              <Card key={post._id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={categoryColors[post.category] || categoryColors.general}>
                          {post.category}
                        </Badge>
                        {post.anonymous && (
                          <Badge variant="outline">Anonymous</Badge>
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
                      variant="ghost"
                      size="sm"
                      onClick={() => handleAddReaction(post._id, 'like')}
                    >
                      <Heart className="h-4 w-4 mr-1" />
                      {post.reactions?.length || 0}
                    </Button>
                    <Dialog open={commentDialogOpen === post._id} onOpenChange={(open) => setCommentDialogOpen(open ? post._id : null)}>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MessageCircle className="h-4 w-4 mr-1" />
                          {post.comments?.length || 0}
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Comments</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          {post.comments?.map((comment, idx) => (
                            <div key={idx} className="border-b pb-2">
                              <p className="text-sm font-medium mb-1">
                                {comment.user?.name || 'Anonymous'}
                              </p>
                              <p className="text-sm text-muted-foreground">{comment.text}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {format(new Date(comment.createdAt), 'PPp')}
                              </p>
                            </div>
                          ))}
                          <div>
                            <Textarea
                              value={newComment}
                              onChange={(e) => setNewComment(e.target.value)}
                              placeholder="Add a comment..."
                              rows={3}
                            />
                            <Button
                              onClick={() => handleAddComment(post._id)}
                              className="mt-2"
                            >
                              Post Comment
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

