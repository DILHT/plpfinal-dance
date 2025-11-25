import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

export const useMindTalkSocket = (onNewPost, onPostUpdated) => {
  const socketRef = useRef(null);
  const callbacksRef = useRef({ onNewPost, onPostUpdated });

  // Update callbacks ref when they change
  useEffect(() => {
    callbacksRef.current = { onNewPost, onPostUpdated };
  }, [onNewPost, onPostUpdated]);

  useEffect(() => {
    // Get socket URL from environment or default
    const socketUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    console.log('Connecting to socket:', socketUrl);

    // Connect to socket server
    const socket = io(socketUrl, {
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
      console.log('New post received:', post);
      if (callbacksRef.current.onNewPost) {
        callbacksRef.current.onNewPost(post);
      }
    });

    // Listen for post updates (reactions, comments)
    socket.on('post-updated', (post) => {
      console.log('Post updated:', post);
      if (callbacksRef.current.onPostUpdated) {
        callbacksRef.current.onPostUpdated(post);
      }
    });

    // Cleanup on unmount
    return () => {
      if (socket) {
        console.log('Cleaning up socket connection');
        socket.emit('leave-mindtalk');
        socket.disconnect();
      }
    };
  }, []); // Empty deps - only run once on mount

  return socketRef.current;
};