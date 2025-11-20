import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { updateProfile } from '@/services/user.service';
import { getUserVideos } from '@/services/video.service';
import { toast } from 'sonner';
import { User, Video } from 'lucide-react';

export default function ProfilePage() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState({
    name: '',
    danceStyle: '',
    bio: '',
    profilePic: null,
  });
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (user) {
      setProfileData({
        name: user.name || '',
        danceStyle: user.danceStyle || '',
        bio: user.bio || '',
      });
      loadVideos();
    }
  }, [user, isAuthenticated, navigate]);

  const loadVideos = async () => {
    try {
      const data = await getUserVideos(user.id);
      setVideos(data);
    } catch (error) {
      console.error('Error loading videos:', error);
    }
  };

  const handleFileChange = (e) => {
    setProfileData({ ...profileData, profilePic: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('name', profileData.name);
    formData.append('danceStyle', profileData.danceStyle);
    formData.append('bio', profileData.bio);
    if (profileData.profilePic) {
      formData.append('profilePic', profileData.profilePic);
    }

    try {
      await updateProfile(formData);
      toast.success('Profile updated successfully');
      window.location.reload();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">My Profile</h1>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <Card>
              <CardHeader className="text-center">
                <Avatar className="h-24 w-24 mx-auto mb-4">
                  <AvatarImage src={user.profilePic} alt={user.name} />
                  <AvatarFallback>
                    {user.name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <CardTitle>{user.name}</CardTitle>
                {user.danceStyle && (
                  <CardDescription>{user.danceStyle}</CardDescription>
                )}
              </CardHeader>
              <CardContent>
                {user.bio && <p className="text-sm">{user.bio}</p>}
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Edit Profile</CardTitle>
                <CardDescription>Update your profile information</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="danceStyle">Dance Style</Label>
                    <Input
                      id="danceStyle"
                      value={profileData.danceStyle}
                      onChange={(e) => setProfileData({ ...profileData, danceStyle: e.target.value })}
                      placeholder="e.g., Hip-hop, Contemporary"
                    />
                  </div>

                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={profileData.bio}
                      onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                      rows={4}
                      maxLength={500}
                    />
                  </div>

                  <div>
                    <Label htmlFor="profilePic">Profile Picture</Label>
                    <Input
                      id="profilePic"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </div>

                  <Button type="submit" disabled={loading}>
                    {loading ? 'Saving...' : 'Save Changes'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="h-5 w-5" />
                  My Videos
                </CardTitle>
              </CardHeader>
              <CardContent>
                {videos.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No videos yet. Upload your first video!
                  </p>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    {videos.map((video) => (
                      <div key={video._id} className="aspect-video bg-muted rounded-lg">
                        {video.videoUrl && (
                          <video src={video.videoUrl} className="w-full h-full object-cover rounded-lg" />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

