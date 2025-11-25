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
  const [commentCount, setCommentCount] = useState(post.comments?.length || 0);

  const handleOpenClick = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    console.log('Comment dialog opened for post:', post._id);
    setOpen(true);
  };

  const handleSubmit = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (!comment.trim() || isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      await onComment(post._id, comment);
      setComment('');
      setOpen(false);
      // Success toast is handled by mutation's onSuccess
    } catch (error) {
      console.error('Error adding comment:', error);
      // Error toast is handled by mutation's onError
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setOpen(false);
    setComment('');
  };

  // Update comment count when post updates
  const currentCommentCount = post.comments?.length || 0;

  return (
    <>
      {/* Comment Button - Native HTML button with large hit area */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleOpenClick(e);
        }}
        className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 cursor-pointer active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 group/comment hover:bg-blue-50 dark:hover:bg-blue-950/20"
        aria-label={`View comments (${currentCommentCount} comments)`}
        data-post-id={post._id}
      >
        <MessageCircle className="h-5 w-5 text-muted-foreground group-hover/comment:text-blue-500 transition-colors" />
        <span className="font-medium text-sm text-muted-foreground group-hover/comment:text-blue-500 transition-colors">
          {currentCommentCount}
        </span>
      </button>
      
      <Dialog 
        open={open} 
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            handleClose();
          } else {
            setOpen(true);
          }
        }}
        modal={true}
        key={`dialog-${post._id}`}
      >
        <DialogContent 
          className="max-w-2xl max-h-[80vh] flex flex-col bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700"
          onClick={(e) => e.stopPropagation()}
        >
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-slate-100">Comments</DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 overflow-hidden flex flex-col space-y-4">
            {/* Comments List - Scrollable */}
            {post.comments && post.comments.length > 0 ? (
              <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                {post.comments.map((commentItem, idx) => (
                  <div 
                    key={idx} 
                    className="border-b border-gray-200 dark:border-slate-700 pb-3 last:border-0"
                  >
                    <div className="flex items-start gap-2 mb-1">
                      <p className="text-sm font-semibold text-gray-900 dark:text-slate-100">
                        {commentItem.user?.name || 'Anonymous'}
                      </p>
                      <span className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
                        {format(new Date(commentItem.createdAt), 'PPp')}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-slate-300 whitespace-pre-wrap">
                      {commentItem.text}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center py-8">
                <p className="text-sm text-muted-foreground text-center">
                  No comments yet. Be the first to comment!
                </p>
              </div>
            )}
            
            {/* Comment Input - Fixed at bottom */}
            <div className="pt-4 border-t border-gray-200 dark:border-slate-700">
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment..."
                rows={3}
                className="mb-3 bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 border-gray-300 dark:border-slate-600 placeholder:text-gray-400 dark:placeholder:text-slate-400 focus:ring-2 focus:ring-primary focus:border-primary"
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
                  disabled={isSubmitting}
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
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Press Ctrl+Enter (or Cmd+Enter on Mac) to submit
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
