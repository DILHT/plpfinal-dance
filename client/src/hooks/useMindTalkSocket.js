import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

export const useMindTalkSocket = (onNewPost, onPostUpdated) => {
  const socketRef = useRef(null);

  useEffect(() => {
    // Connect to socket server
    const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
      socket.emit('join-mindtalk');
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    // Listen for new posts
    socket.on('new-post', (post) => {
      console.log('Received new post:', post);
      onNewPost(post);
    });

    // Listen for post updates (reactions, comments)
    socket.on('post-updated', (post) => {
      console.log('Received post update:', post);
      onPostUpdated(post);
    });

    // Cleanup on unmount
    return () => {
      if (socket) {
        socket.emit('leave-mindtalk');
        socket.disconnect();
      }
    };
  }, [onNewPost, onPostUpdated]);

  return socketRef.current;
};