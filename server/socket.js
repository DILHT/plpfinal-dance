import { Server } from 'socket.io';

let io;

export const initializeSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: process.env.CLIENT_URL || 'http://localhost:5173',
            methods: ['GET', 'POST'],
            credentials: true
        }
    });

    io.on('connection', (socket) => {
        console.log('User connected:', socket.id);

        // Join the mindtalk room
        socket.on('join-mindtalk', () => {
            socket.join('mindtalk');
            console.log(`User ${socket.id} joined mindtalk room`);
        });

        // Leave the mindtalk room
        socket.on('leave-mindtalk', () => {
            socket.leave('mindtalk');
            console.log(`User ${socket.id} left mindtalk room`);
        });

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
    });

    return io;
};

export const getIO = () => {
    if (!io) {
        throw new Error('Socket.io not initialized');
    }
    return io;
};

