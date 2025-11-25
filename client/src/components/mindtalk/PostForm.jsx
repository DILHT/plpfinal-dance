import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

export default function PostForm({ onCreatePost }) {
  const [open, setOpen] = useState(false);
  const [post, setPost] = useState({ text: '', category: 'general', anonymous: true });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenClick = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    console.log('Opening post form dialog');
    setOpen(true);
  };

  const handleSubmit = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (!post.text.trim() || isSubmitting) return;
    
    // Validate character limit
    if (post.text.length > 2000) {
      toast.error('Post text cannot exceed 2000 characters');
      return;
    }
    
    console.log('Submitting post:', post);
    setIsSubmitting(true);
    try {
      await onCreatePost(post);
      setPost({ text: '', category: 'general', anonymous: true });
      setOpen(false);
    } catch (error) {
      console.error('Error creating post:', error);
      // Error toast is handled by mutation's onError, so we don't show it here
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setOpen(false);
    // Reset form on cancel
    setPost({ text: '', category: 'general', anonymous: true });
  };

  return (
    <div className="relative z-10">
      {/* Prominent, always-visible button */}
      <div className='flex py-3 justify-end'>
      <button
        type="button"
        onClick={handleOpenClick}
        className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold text-base shadow-lg hover:bg-primary/90 transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 cursor-pointer min-h-[48px]"
        aria-label="Create new post"
      >
        <Plus className="h-5 w-5" />
        New Post
      </button>
      </div>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent 
          className="sm:max-w-[500px] bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700"
          onClick={(e) => e.stopPropagation()}
        >
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-slate-100">Create New Post</DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-slate-400">
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
                className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary cursor-pointer"
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
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.length <= 2000) {
                    setPost({ ...post, text: value });
                  }
                }}
                placeholder="Share what's on your mind..."
                rows={6}
                className="mt-1 bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 border-gray-300 dark:border-slate-600 placeholder:text-gray-400 dark:placeholder:text-slate-400 focus:ring-2 focus:ring-primary focus:border-primary"
                required
                maxLength={2000}
              />
              <p className={`text-xs mt-1 ${
                post.text.length > 1900 
                  ? 'text-orange-600 dark:text-orange-400' 
                  : 'text-gray-500 dark:text-slate-400'
              }`}>
                {post.text.length}/2000 characters
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="anonymous"
                checked={post.anonymous}
                onChange={(e) => setPost({ ...post, anonymous: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-primary focus:ring-primary cursor-pointer"
              />
              <Label htmlFor="anonymous" className="cursor-pointer font-normal text-gray-900 dark:text-slate-100">
                Post anonymously
              </Label>
            </div>
            <div className="flex gap-2 pt-2">
              <Button 
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="flex-1"
                disabled={isSubmitting}
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
