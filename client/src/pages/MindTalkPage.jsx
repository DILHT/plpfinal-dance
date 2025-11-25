// import { useEffect, useState, useCallback } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Card, CardContent } from '@/components/ui/card';
// import { useAuth } from '@/hooks/useAuth';
// import { getAllPosts, createPost, addReaction, addComment } from '@/services/mindtalk.service';
// import { toast } from 'sonner';
// import { MessageCircle, Loader2 } from 'lucide-react';
// import PostCard from '@/components/mindtalk/PostCard';
// import PostForm from '@/components/mindtalk/PostForm';
// import { useMindTalkSocket } from '@/hooks/useMindTalkSocket';

// export default function MindTalkPage() {
//   const [posts, setPosts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const { isAuthenticated, user } = useAuth();
//   const navigate = useNavigate();

//   // Stable callbacks for socket - use useCallback to prevent re-renders
//   const handleNewPost = useCallback((newPost) => {
//     console.log('New post received via socket:', newPost);
//     setPosts((prevPosts) => {
//       // Check if post already exists (avoid duplicates)
//       const exists = prevPosts.some(p => p._id === newPost._id);
//       if (exists) {
//         return prevPosts;
//       }
//       return [newPost, ...prevPosts];
//     });
//   }, []);

//   const handlePostUpdated = useCallback((updatedPost) => {
//     console.log('Post updated via socket:', updatedPost);
//     setPosts((prevPosts) =>
//       prevPosts.map((post) =>
//         post._id === updatedPost._id ? updatedPost : post
//       )
//     );
//   }, []);

//   // Initialize socket connection
//   useMindTalkSocket(handleNewPost, handlePostUpdated);

//   // Load posts on mount
//   useEffect(() => {
//     if (!isAuthenticated) {
//       console.log('User not authenticated, redirecting to login');
//       navigate('/login');
//       return;
//     }

//     // Check if user is approved (if needed)
//     if (user && user.status !== 'approved') {
//       toast.error('Only approved members can access MindTalk');
//       navigate('/room');
//       return;
//     }

//     loadPosts();
//   }, [isAuthenticated, user, navigate]);

//   const loadPosts = async () => {
//     try {
//       setLoading(true);
//       console.log('Loading posts...');
//       const data = await getAllPosts();
//       // Sort by newest first
//       const sortedPosts = Array.isArray(data) ? data.sort((a, b) => 
//         new Date(b.createdAt) - new Date(a.createdAt)
//       ) : [];
//       setPosts(sortedPosts);
//       console.log('Posts loaded:', sortedPosts.length);
//     } catch (error) {
//       console.error('Error loading posts:', error);
//       toast.error('Failed to load posts. Please refresh the page.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCreatePost = async (postData) => {
//     try {
//       console.log('Creating post:', postData);
//       const newPost = await createPost(postData);
//       console.log('Post created, waiting for socket update:', newPost);
//       // Socket.io will handle the real-time update via 'new-post' event
//       // But we can also optimistically add it
//       if (newPost) {
//         setPosts((prevPosts) => [newPost, ...prevPosts]);
//       }
//     } catch (error) {
//       console.error('Error creating post:', error);
//       toast.error(error.response?.data?.message || 'Failed to create post. Please try again.');
//       throw error;
//     }
//   };

//   const handleAddReaction = async (postId, type = 'like') => {
//     try {
//       console.log('Adding reaction to post:', postId);
//       await addReaction(postId, type);
//       // Socket.io will handle the real-time update via 'post-updated' event
//     } catch (error) {
//       console.error('Error adding reaction:', error);
//       toast.error('Failed to add reaction. Please try again.');
//       throw error;
//     }
//   };

//   const handleAddComment = async (postId, commentText) => {
//     try {
//       console.log('Adding comment to post:', postId);
//       await addComment(postId, commentText);
//       // Socket.io will handle the real-time update via 'post-updated' event
//     } catch (error) {
//       console.error('Error adding comment:', error);
//       toast.error('Failed to add comment. Please try again.');
//       throw error;
//     }
//   };

//   // Show nothing while checking auth
//   if (!isAuthenticated) {
//     return null;
//   }

//   // Loading state
//   if (loading) {
//     return (
//       <div className="container mx-auto px-4 py-12">
//         <div className="max-w-4xl mx-auto">
//           <div className="flex flex-col items-center justify-center py-20">
//             <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
//             <p className="text-muted-foreground">Loading posts...</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto px-4 py-8 md:py-12">
//       <div className="max-w-4xl mx-auto">
//         {/* Header Section */}
//         <div className="mb-8">
//           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
//             <div>
//               <h1 className="text-3xl md:text-4xl font-bold mb-2">MindTalk Room</h1>
//               <p className="text-muted-foreground text-sm md:text-base">
//                 Share your thoughts anonymously in a safe space. Your voice matters.
//               </p>
//             </div>
//             {/* New Post Button - Prominent and always visible */}
//             <div className="flex shrink-0">
//             <PostForm  onCreatePost={handleCreatePost}/> 
//             </div>
//           </div>
//         </div>

//         {/* Posts Feed */}
//         <div className="space-y-4">
//           {posts.length === 0 ? (
//             <Card className="border-2 border-dashed">
//               <CardContent className="py-16 text-center">
//                 <MessageCircle className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
//                 <h3 className="text-xl font-semibold mb-2">No posts yet</h3>
//                 <p className="text-muted-foreground mb-4">
//                   Be the first to share your thoughts with the community!
//                 </p>
//                 <PostForm onCreatePost={handleCreatePost} />
//               </CardContent>
//             </Card>
//           ) : (
//             posts.map((post) => (
              
//               <PostCard
//                 key={post._id}
//                 post={post}
//                 onReaction={handleAddReaction}
//                 onComment={handleAddComment}
//               />
//             ))
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
