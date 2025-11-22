import { createServer } from 'http';
import app from './express.js';
import connectDB from './config/db.js';
import config from './config/config.js';
import { initializeSocket } from './socket.js';

connectDB();

const PORT = config.port || 5000;

const httpServer = createServer(app);

// Initialize Socket.io
initializeSocket(httpServer);

httpServer.listen(PORT, () => {
    console.log(`Server running in ${config.nodeEnv} mode on port ${PORT}`);
    console.log(`Socket.io initialized`);
});

