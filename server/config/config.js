import dotenv from 'dotenv';

dotenv.config();

export default {
    port: process.env.PORT || 5000,
    nodeEnv: process.env.NODE_ENV || 'development',
    mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/d4c',
    jwtSecret: process.env.JWT_SECRET || 'fallback-secret-change-in-production',
    clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
    cloudinary: {
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        apiKey: process.env.CLOUDINARY_API_KEY,
        apiSecret: process.env.CLOUDINARY_API_SECRET
    }
};

