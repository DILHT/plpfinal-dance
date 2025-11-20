import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getPendingUsers, approveUser, rejectUser } from '@/services/user.service';
import { getAllPosts, deletePost } from '@/services/mindtalk.service';
import { getAllVideos, deleteVideo } from '@/services/video.service';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Users, MessageCircle, Video, Check, X, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

export default function AdminDashboard() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      navigate('/');
    }
  }, [isAuthenticated, user, navigate]);

  const { data: pendingUsers = [], isLoading: usersLoading } = useQuery({
    queryKey: ['pending-users'],
    queryFn: getPendingUsers,
    enabled: isAuthenticated && user?.role === 'admin',
  });

  const { data: posts = [], isLoading: postsLoading } = useQuery({
    queryKey: ['mindtalk-posts'],
    queryFn: getAllPosts,
    enabled: isAuthenticated && user?.role === 'admin',
  });

  const { data: videos = [], isLoading: videosLoading } = useQuery({
    queryKey: ['all-videos'],
    queryFn: getAllVideos,
    enabled: isAuthenticated && user?.role === 'admin',
  });

  const approveMutation = useMutation({
    mutationFn: approveUser,
    onSuccess: () => {
      toast.success('User approved');
      queryClient.invalidateQueries({ queryKey: ['pending-users'] });
    },
    onError: () => {
      toast.error('Error approving user');
    },
  });

  const rejectMutation = useMutation({
    mutationFn: rejectUser,
    onSuccess: () => {
      toast.success('User rejected');
      queryClient.invalidateQueries({ queryKey: ['pending-users'] });
    },
    onError: () => {
      toast.error('Error rejecting user');
    },
  });

  const deletePostMutation = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      toast.success('Post deleted');
      queryClient.invalidateQueries({ queryKey: ['mindtalk-posts'] });
    },
    onError: () => {
      toast.error('Error deleting post');
    },
  });

  const deleteVideoMutation = useMutation({
    mutationFn: deleteVideo,
    onSuccess: () => {
      toast.success('Video deleted');
      queryClient.invalidateQueries({ queryKey: ['all-videos'] });
    },
    onError: () => {
      toast.error('Error deleting video');
    },
  });

  const handleApprove = (userId) => {
    approveMutation.mutate(userId);
  };

  const handleReject = (userId) => {
    rejectMutation.mutate(userId);
  };

  const handleDeletePost = (postId) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    deletePostMutation.mutate(postId);
  };

  const handleDeleteVideo = (videoId) => {
    if (!confirm('Are you sure you want to delete this video?')) return;
    deleteVideoMutation.mutate(videoId);
  };

  const loading = usersLoading || postsLoading || videosLoading;

  if (!isAuthenticated || user?.role !== 'admin') {
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
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList>
            <TabsTrigger value="users">
              <Users className="h-4 w-4 mr-2" />
              Pending Users ({pendingUsers.length})
            </TabsTrigger>
            <TabsTrigger value="posts">
              <MessageCircle className="h-4 w-4 mr-2" />
              Posts ({posts.length})
            </TabsTrigger>
            <TabsTrigger value="videos">
              <Video className="h-4 w-4 mr-2" />
              Videos ({videos.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Pending User Applications</CardTitle>
                <CardDescription>
                  Review and approve or reject user applications
                </CardDescription>
              </CardHeader>
              <CardContent>
                {pendingUsers.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No pending applications
                  </p>
                ) : (
                  <div className="space-y-4">
                    {pendingUsers.map((pendingUser) => (
                      <Card key={pendingUser._id}>
                        <CardContent className="pt-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-semibold">{pendingUser.name}</h3>
                              <p className="text-sm text-muted-foreground">{pendingUser.email}</p>
                              {pendingUser.danceStyle && (
                                <Badge variant="secondary" className="mt-2">
                                  {pendingUser.danceStyle}
                                </Badge>
                              )}
                              {pendingUser.bio && (
                                <p className="text-sm mt-2">{pendingUser.bio}</p>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleApprove(pendingUser._id)}
                              >
                                <Check className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleReject(pendingUser._id)}
                              >
                                <X className="h-4 w-4 mr-1" />
                                Reject
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="posts">
            <Card>
              <CardHeader>
                <CardTitle>MindTalk Posts</CardTitle>
                <CardDescription>
                  Manage posts in the MindTalk room
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {posts.map((post) => (
                    <Card key={post._id}>
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge>{post.category}</Badge>
                            </div>
                            <p className="text-sm mb-2">{post.text}</p>
                            <p className="text-xs text-muted-foreground">
                              {format(new Date(post.createdAt), 'PPp')}
                            </p>
                          </div>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeletePost(post._id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="videos">
            <Card>
              <CardHeader>
                <CardTitle>Videos</CardTitle>
                <CardDescription>
                  Manage uploaded videos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {videos.map((video) => (
                    <Card key={video._id}>
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold mb-2">{video.title}</h3>
                            {video.author && (
                              <p className="text-sm text-muted-foreground mb-2">
                                By {video.author.name}
                              </p>
                            )}
                            {video.description && (
                              <p className="text-sm mb-2">{video.description}</p>
                            )}
                          </div>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteVideo(video._id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

