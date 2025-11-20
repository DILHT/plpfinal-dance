import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getAllPosts } from '@/services/mindtalk.service';
import { useAuth } from '@/hooks/useAuth';
import { MessageCircle, Heart } from 'lucide-react';
import { format } from 'date-fns';

export default function RoomPreviewPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { data: posts, isLoading } = useQuery({
    queryKey: ['mindtalk-posts'],
    queryFn: getAllPosts,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">Loading posts...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">MindTalk Room</h1>
          <p className="text-muted-foreground mb-4">
            A safe space for anonymous sharing. View posts below. To post, react, or comment, please log in as an approved member.
          </p>
          {!isAuthenticated && (
            <Button onClick={() => navigate('/login')}>
              Login to Participate
            </Button>
          )}
        </div>

        <div className="space-y-4">
          {posts && posts.length > 0 ? (
            posts.map((post) => (
              <Card key={post._id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{post.category}</Badge>
                      {post.anonymous && <Badge variant="secondary">Anonymous</Badge>}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {format(new Date(post.createdAt), 'MMM d, yyyy')}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 whitespace-pre-wrap">{post.text}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Heart className="h-4 w-4" />
                      <span>{post.reactions?.length || 0}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="h-4 w-4" />
                      <span>{post.comments?.length || 0}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                No posts yet. Be the first to share!
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
