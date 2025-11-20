import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { getAllVideos, uploadVideo } from '@/services/video.service';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Video, Upload, Play } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';

export default function VideosPage() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [uploadData, setUploadData] = useState({
    title: '',
    description: '',
    danceStyle: '',
    video: null,
  });
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    try {
      const data = await getAllVideos();
      setVideos(data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading videos:', error);
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setUploadData({ ...uploadData, video: e.target.files[0] });
  };

  const handleUpload = async () => {
    if (!uploadData.title || !uploadData.video) {
      toast.error('Please fill in title and select a video');
      return;
    }

    const formData = new FormData();
    formData.append('title', uploadData.title);
    formData.append('description', uploadData.description);
    formData.append('danceStyle', uploadData.danceStyle);
    formData.append('video', uploadData.video);

    try {
      await uploadVideo(formData);
      toast.success('Video uploaded successfully');
      setUploadData({ title: '', description: '', danceStyle: '', video: null });
      setUploadDialogOpen(false);
      loadVideos();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error uploading video');
    }
  };

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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Dance Videos</h1>
            <p className="text-muted-foreground">
              Watch inspiring dance performances from our community
            </p>
          </div>
          {isAuthenticated && (
            <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Video
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Upload Dance Video</DialogTitle>
                  <DialogDescription>
                    Share your dance performance with the community
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Title *</Label>
                    <Input
                      value={uploadData.title}
                      onChange={(e) => setUploadData({ ...uploadData, title: e.target.value })}
                      placeholder="Video title"
                    />
                  </div>
                  <div>
                    <Label>Dance Style</Label>
                    <Input
                      value={uploadData.danceStyle}
                      onChange={(e) => setUploadData({ ...uploadData, danceStyle: e.target.value })}
                      placeholder="e.g., Hip-hop, Contemporary"
                    />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea
                      value={uploadData.description}
                      onChange={(e) => setUploadData({ ...uploadData, description: e.target.value })}
                      placeholder="Describe your video..."
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label>Video File *</Label>
                    <Input type="file" accept="video/*" onChange={handleFileChange} />
                  </div>
                  <Button onClick={handleUpload} className="w-full">
                    Upload
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {videos.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              <Video className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No videos yet. Be the first to share!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <Card key={video._id} className="cursor-pointer" onClick={() => setSelectedVideo(video)}>
                <CardHeader>
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center mb-4">
                    {video.videoUrl ? (
                      <video src={video.videoUrl} className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <Play className="h-12 w-12 text-muted-foreground" />
                    )}
                  </div>
                  <CardTitle className="line-clamp-2">{video.title}</CardTitle>
                  {video.author && (
                    <CardDescription>
                      By {video.author.name}
                    </CardDescription>
                  )}
                </CardHeader>
                {video.description && (
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {video.description}
                    </p>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}

        {selectedVideo && (
          <Dialog open={!!selectedVideo} onOpenChange={() => setSelectedVideo(null)}>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>{selectedVideo.title}</DialogTitle>
                {selectedVideo.author && (
                  <DialogDescription>
                    By {selectedVideo.author.name}
                  </DialogDescription>
                )}
              </DialogHeader>
              <div className="mt-4">
                {selectedVideo.videoUrl && (
                  <video src={selectedVideo.videoUrl} controls className="w-full rounded-lg" />
                )}
                {selectedVideo.description && (
                  <p className="mt-4 text-sm">{selectedVideo.description}</p>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}

