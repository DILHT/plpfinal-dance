import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';

// Custom storage engine for Cloudinary v2 compatibility
class CloudinaryStorage {
    constructor(options) {
        this.params = options.params || {};
    }

    _handleFile(req, file, cb) {
        const buffer = [];
        
        file.stream.on('data', (chunk) => {
            buffer.push(chunk);
        });
        
        file.stream.on('end', () => {
            const fileBuffer = Buffer.concat(buffer);
            
            // Determine resource type based on mimetype
            let resourceType = 'auto';
            if (file.mimetype.startsWith('image/')) {
                resourceType = 'image';
            } else if (file.mimetype.startsWith('video/')) {
                resourceType = 'video';
            }
            
            cloudinary.uploader.upload_stream(
                {
                    folder: this.params.folder || 'd4c',
                    resource_type: resourceType,
                    format: file.mimetype.split('/')[1],
                },
                (error, result) => {
                    if (error) {
                        return cb(error);
                    }
                    cb(null, {
                        path: result.secure_url,
                        public_id: result.public_id,
                        format: result.format,
                        resource_type: result.resource_type,
                        bytes: result.bytes,
                        width: result.width,
                        height: result.height,
                    });
                }
            ).end(fileBuffer);
        });
        
        file.stream.on('error', (error) => {
            cb(error);
        });
    }

    _removeFile(req, file, cb) {
        // Extract public_id from the path or use the stored public_id
        if (file.public_id) {
            cloudinary.uploader.destroy(file.public_id, (error) => {
                cb(error);
            });
        } else {
            cb(null);
        }
    }
}

// Configure Cloudinary storage for multer
const storage = new CloudinaryStorage({
    params: {
        folder: 'd4c',
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'mp4', 'mov', 'avi'],
        resource_type: 'auto'
    }
});

// File filter for images and videos
const fileFilter = (req, file, cb) => {
    const allowedMimes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'video/mp4',
        'video/mov',
        'video/avi',
        'video/quicktime'
    ];

    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only image and video files are allowed'), false);
    }
};

export const upload = multer({
    storage,
    limits: {
        fileSize: 50 * 1024 * 1024 // 50MB for videos
    },
    fileFilter
});

