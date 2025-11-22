import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MessageCircle } from 'lucide-react';
import { format } from 'date-fns';

export default function CommentDialog({ post, onComment }) {
  const [open, setOpen] = useState(false);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setOpen(true);
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (!comment.trim() || isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      await onComment(post._id, comment);
      setComment('');
      setOpen(false);
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Button 
        type="button"
        variant="ghost" 
        size="sm"
        onClick={handleOpenClick}
        className="cursor-pointer hover:bg-accent flex items-center gap-1"
        style={{ pointerEvents: 'auto', zIndex: 10 }}
      >
        <MessageCircle className="h-4 w-4" />
        <span>{post.comments?.length || 0}</span>
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent 
        className="max-w-2xl max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <DialogHeader>
          <DialogTitle>Comments</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {post.comments && post.comments.length > 0 ? (
            <div className="space-y-3 max-h-[300px] overflow-y-auto">
              {post.comments.map((commentItem, idx) => (
                <div key={idx} className="border-b pb-3 last:border-0">
                  <p className="text-sm font-medium mb-1">
                    {commentItem.user?.name || 'Anonymous'}
                  </p>
                  <p className="text-sm text-muted-foreground">{commentItem.text}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {format(new Date(commentItem.createdAt), 'PPp')}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              No comments yet. Be the first to comment!
            </p>
          )}
          <div className="pt-2">
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add a comment..."
              rows={3}
              className="mb-2"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="flex-1"
              >
                Close
              </Button>
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={!comment.trim() || isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? 'Posting...' : 'Post Comment'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
      </Dialog>
    </>
  );
}

