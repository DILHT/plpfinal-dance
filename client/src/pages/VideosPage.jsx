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
        <div className="text-center text-gray-600 dark:text-slate-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2 text-gray-900 dark:text-slate-100">Dance Videos</h1>
            <p className="text-gray-600 dark:text-slate-400">
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
              <DialogContent className="bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700">
                <DialogHeader>
                  <DialogTitle className="text-gray-900 dark:text-slate-100">Upload Dance Video</DialogTitle>
                  <DialogDescription className="text-gray-600 dark:text-slate-400">
                    Share your dance performance with the community
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label className="text-gray-900 dark:text-slate-100">Title *</Label>
                    <Input
                      value={uploadData.title}
                      onChange={(e) => setUploadData({ ...uploadData, title: e.target.value })}
                      placeholder="Video title"
                      className="bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 border-gray-300 dark:border-slate-600 placeholder:text-gray-400 dark:placeholder:text-slate-400"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-900 dark:text-slate-100">Dance Style</Label>
                    <Input
                      value={uploadData.danceStyle}
                      onChange={(e) => setUploadData({ ...uploadData, danceStyle: e.target.value })}
                      placeholder="e.g., Hip-hop, Contemporary"
                      className="bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 border-gray-300 dark:border-slate-600 placeholder:text-gray-400 dark:placeholder:text-slate-400"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-900 dark:text-slate-100">Description</Label>
                    <Textarea
                      value={uploadData.description}
                      onChange={(e) => setUploadData({ ...uploadData, description: e.target.value })}
                      placeholder="Describe your video..."
                      rows={3}
                      className="bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 border-gray-300 dark:border-slate-600 placeholder:text-gray-400 dark:placeholder:text-slate-400"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-900 dark:text-slate-100">Video File *</Label>
                    <Input 
                      type="file" 
                      accept="video/*" 
                      onChange={handleFileChange}
                      className="bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 border-gray-300 dark:border-slate-600"
                    />
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
          <Card className="bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700">
            <CardContent className="py-12 text-center text-gray-600 dark:text-slate-400">
              <Video className="h-12 w-12 mx-auto mb-4 opacity-50 text-gray-400 dark:text-slate-500" />
              <p>No videos yet. Be the first to share!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <Card 
                key={video._id} 
                className="cursor-pointer bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow" 
                onClick={() => setSelectedVideo(video)}
              >
                <CardHeader>
                  <div className="aspect-video bg-gray-100 dark:bg-slate-700 rounded-lg flex items-center justify-center mb-4">
                    {video.videoUrl ? (
                      <video src={video.videoUrl} className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <Play className="h-12 w-12 text-gray-400 dark:text-slate-500" />
                    )}
                  </div>
                  <CardTitle className="line-clamp-2 text-gray-900 dark:text-slate-100">{video.title}</CardTitle>
                  {video.author && (
                    <CardDescription className="text-gray-600 dark:text-slate-400">
                      By {video.author.name}
                    </CardDescription>
                  )}
                </CardHeader>
                {video.description && (
                  <CardContent>
                    <p className="text-sm text-gray-600 dark:text-slate-400 line-clamp-2">
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
            <DialogContent className="max-w-4xl bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700">
              <DialogHeader>
                <DialogTitle className="text-gray-900 dark:text-slate-100">{selectedVideo.title}</DialogTitle>
                {selectedVideo.author && (
                  <DialogDescription className="text-gray-600 dark:text-slate-400">
                    By {selectedVideo.author.name}
                  </DialogDescription>
                )}
              </DialogHeader>
              <div className="mt-4">
                {selectedVideo.videoUrl && (
                  <video src={selectedVideo.videoUrl} controls className="w-full rounded-lg" />
                )}
                {selectedVideo.description && (
                  <p className="mt-4 text-sm text-gray-600 dark:text-slate-400">{selectedVideo.description}</p>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}

