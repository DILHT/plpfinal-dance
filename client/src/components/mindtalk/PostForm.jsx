import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';

export default function PostForm({ onCreatePost }) {
  const [open, setOpen] = useState(false);
  const [post, setPost] = useState({ text: '', category: 'general', anonymous: true });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Opening post form dialog');
    setOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!post.text.trim() || isSubmitting) return;
    
    console.log('Submitting post:', post);
    setIsSubmitting(true);
    try {
      await onCreatePost(post);
      setPost({ text: '', category: 'general', anonymous: true });
      setOpen(false);
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setOpen(false);
  };

  return (
    <div>
      <Button 
        type="button"
        onClick={handleOpenClick}
        className="flex items-center gap-2"
      >
        <Plus className="h-4 w-4" />
        New Post
      </Button>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Post</DialogTitle>
            <DialogDescription>
              Share what's on your mind. You can choose to post anonymously or with your name.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                value={post.category}
                onChange={(e) => setPost({ ...post, category: e.target.value })}
                className="w-full mt-1 px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="general">General</option>
                <option value="anxiety">Anxiety</option>
                <option value="depression">Depression</option>
                <option value="stress">Stress</option>
                <option value="motivation">Motivation</option>
                <option value="gratitude">Gratitude</option>
              </select>
            </div>
            <div>
              <Label htmlFor="text">Your Thoughts</Label>
              <Textarea
                id="text"
                value={post.text}
                onChange={(e) => setPost({ ...post, text: e.target.value })}
                placeholder="Share what's on your mind..."
                rows={6}
                className="mt-1"
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                {post.text.length}/2000 characters
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="anonymous"
                checked={post.anonymous}
                onChange={(e) => setPost({ ...post, anonymous: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
              />
              <Label htmlFor="anonymous" className="cursor-pointer font-normal">
                Post anonymously
              </Label>
            </div>
            <div className="flex gap-2 pt-2">
              <Button 
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={!post.text.trim() || isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? 'Posting...' : post.anonymous ? 'Post Anonymously' : 'Post'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}