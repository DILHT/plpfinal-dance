import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import User from './models/user.model.js';
import MindTalk from './models/mindtalk.model.js';
import Video from './models/video.model.js';
import Booking from './models/booking.model.js';

dotenv.config();

const seedDatabase = async () => {
    try {
        // Connect to database with error handling
        console.log('Attempting to connect to MongoDB...');
        console.log('MongoDB URI:', process.env.MONGODB_URI ? 'Set' : 'NOT SET');
        
        await connectDB();
        console.log('✅ Connected to MongoDB successfully');

        // Clear existing data
        console.log('Clearing existing data...');
        await Promise.all([
            User.deleteMany({}),
            MindTalk.deleteMany({}),
            Video.deleteMany({}),
            Booking.deleteMany({})
        ]);
        console.log('✅ Existing data cleared');

        // Create Users
        console.log('Creating users...');
        
        // Admin user
        const admin = await User.create({
            name: 'Admin User',
            email: 'admin@d4c.com',
            password: 'admin123',
            role: 'admin',
            status: 'approved',
            danceStyle: 'Contemporary',
            bio: 'Administrator of Dance For Change platform. Dedicated to promoting mental health through dance.',
            profilePic: null
        });

        // Approved members
        const member1 = await User.create({
            name: 'Sarah Johnson',
            email: 'sarah@d4c.com',
            password: 'member123',
            role: 'member',
            status: 'approved',
            danceStyle: 'Hip Hop',
            bio: 'Passionate dancer using movement as therapy. Love connecting with others through dance.',
            profilePic: null
        });

        const member2 = await User.create({
            name: 'Michael Chen',
            email: 'michael@d4c.com',
            password: 'member123',
            role: 'member',
            status: 'approved',
            danceStyle: 'Ballet',
            bio: 'Classical dancer exploring the healing power of movement. Always here to support others.',
            profilePic: null
        });

        const member3 = await User.create({
            name: 'Emma Williams',
            email: 'emma@d4c.com',
            password: 'member123',
            role: 'member',
            status: 'approved',
            danceStyle: 'Jazz',
            bio: 'Jazz dancer and mental health advocate. Dance has been my saving grace.',
            profilePic: null
        });

        const member4 = await User.create({
            name: 'David Martinez',
            email: 'david@d4c.com',
            password: 'member123',
            role: 'member',
            status: 'approved',
            danceStyle: 'Latin',
            bio: 'Salsa and bachata enthusiast. Dance helps me express emotions I can\'t put into words.',
            profilePic: null
        });

        const member5 = await User.create({
            name: 'Lisa Anderson',
            email: 'lisa@d4c.com',
            password: 'member123',
            role: 'member',
            status: 'approved',
            danceStyle: 'Modern',
            bio: 'Modern dance teacher and wellness coach. Movement is medicine.',
            profilePic: null
        });

        // Pending users
        const pending1 = await User.create({
            name: 'John Doe',
            email: 'john@d4c.com',
            password: 'pending123',
            role: 'pending',
            status: 'pending',
            danceStyle: 'Breakdance',
            bio: 'New to the community, excited to join!',
            profilePic: null
        });

        const pending2 = await User.create({
            name: 'Maria Garcia',
            email: 'maria@d4c.com',
            password: 'pending123',
            role: 'pending',
            status: 'pending',
            danceStyle: 'Flamenco',
            bio: 'Looking forward to being part of this amazing community.',
            profilePic: null
        });

        console.log('✅ Users created successfully');

        // Create MindTalk Posts
        console.log('Creating MindTalk posts...');

        const posts = await MindTalk.create([
            {
                text: 'Dance has been my escape from anxiety. When I move, I feel free. The rhythm takes over and all my worries fade away. Thank you to everyone in this community for creating such a safe space.',
                category: 'anxiety',
                anonymous: true,
                author: member1._id,
                reactions: [
                    { user: member2._id, type: 'love' },
                    { user: member3._id, type: 'support' },
                    { user: member4._id, type: 'like' }
                ],
                comments: [
                    {
                        user: member2._id,
                        text: 'I completely understand. Dance is my therapy too. Keep moving! 💙',
                        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
                    },
                    {
                        user: member3._id,
                        text: 'You\'re not alone. This community is here for you. Keep dancing!',
                        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
                    }
                ]
            },
            {
                text: 'Having a really tough day today. Depression is hitting hard. But I put on some music and just moved. Even if it was just swaying, it helped. Small steps, right?',
                category: 'depression',
                anonymous: true,
                author: member2._id,
                reactions: [
                    { user: member1._id, type: 'support' },
                    { user: member3._id, type: 'love' },
                    { user: member4._id, type: 'support' },
                    { user: member5._id, type: 'love' }
                ],
                comments: [
                    {
                        user: member1._id,
                        text: 'Small steps are still progress. Proud of you for moving today. You\'ve got this!',
                        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000)
                    }
                ]
            },
            {
                text: 'Work stress has been overwhelming lately. But my evening dance sessions are keeping me sane. There\'s something magical about letting your body express what words can\'t.',
                category: 'stress',
                anonymous: true,
                author: member3._id,
                reactions: [
                    { user: member1._id, type: 'like' },
                    { user: member2._id, type: 'support' },
                    { user: member4._id, type: 'like' }
                ],
                comments: []
            },
            {
                text: 'Today I\'m grateful for this community. For the music, the movement, and the people who understand. Dance has given me hope when I thought there was none.',
                category: 'gratitude',
                anonymous: true,
                author: member4._id,
                reactions: [
                    { user: member1._id, type: 'love' },
                    { user: member2._id, type: 'love' },
                    { user: member3._id, type: 'love' },
                    { user: member5._id, type: 'support' }
                ],
                comments: [
                    {
                        user: member1._id,
                        text: 'We\'re grateful for you too! This community wouldn\'t be the same without you.',
                        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000)
                    },
                    {
                        user: member5._id,
                        text: 'Beautiful words. Grateful to share this journey with you all.',
                        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
                    }
                ]
            },
            {
                text: 'Just finished an amazing dance session! Feeling energized and motivated. Remember, every movement counts. You don\'t need to be perfect, just present.',
                category: 'motivation',
                anonymous: true,
                author: member5._id,
                reactions: [
                    { user: member1._id, type: 'like' },
                    { user: member2._id, type: 'support' },
                    { user: member3._id, type: 'like' },
                    { user: member4._id, type: 'love' }
                ],
                comments: [
                    {
                        user: member2._id,
                        text: 'Needed to hear this today. Thank you for the motivation!',
                        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000)
                    }
                ]
            },
            {
                text: 'Sharing my journey: Dance helped me overcome social anxiety. Starting with solo sessions in my room, now I can dance in groups. Progress is possible!',
                category: 'general',
                anonymous: true,
                author: member1._id,
                reactions: [
                    { user: member2._id, type: 'love' },
                    { user: member3._id, type: 'support' },
                    { user: member4._id, type: 'love' },
                    { user: member5._id, type: 'support' }
                ],
                comments: [
                    {
                        user: member3._id,
                        text: 'Inspiring story! Thank you for sharing. It gives hope to others.',
                        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000)
                    }
                ]
            },
            {
                text: 'Bad day today. Anxiety is through the roof. But I know tomorrow I\'ll dance again, and that gives me something to hold onto.',
                category: 'anxiety',
                anonymous: true,
                author: member2._id,
                reactions: [
                    { user: member1._id, type: 'support' },
                    { user: member4._id, type: 'support' }
                ],
                comments: []
            },
            {
                text: 'Mental health tip: Even 5 minutes of movement can change your day. Don\'t underestimate the power of small actions.',
                category: 'motivation',
                anonymous: true,
                author: member5._id,
                reactions: [
                    { user: member1._id, type: 'like' },
                    { user: member2._id, type: 'like' },
                    { user: member3._id, type: 'support' }
                ],
                comments: []
            }
        ]);

        console.log('✅ MindTalk posts created successfully');

        // Create Videos
        console.log('Creating videos...');

        const videos = await Video.create([
            {
                title: 'Hip Hop Therapy Session',
                description: 'A high-energy hip hop session focused on releasing stress and building confidence.',
                videoUrl: 'https://res.cloudinary.com/demo/video/upload/sample.mp4',
                thumbnail: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
                author: member1._id,
                danceStyle: 'Hip Hop',
                isPublic: true
            },
            {
                title: 'Calming Ballet Flow',
                description: 'Gentle ballet movements for anxiety relief and mindfulness.',
                videoUrl: 'https://res.cloudinary.com/demo/video/upload/sample.mp4',
                thumbnail: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
                author: member2._id,
                danceStyle: 'Ballet',
                isPublic: true
            },
            {
                title: 'Jazz Improvisation Workshop',
                description: 'Express yourself freely through jazz dance improvisation.',
                videoUrl: 'https://res.cloudinary.com/demo/video/upload/sample.mp4',
                thumbnail: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
                author: member3._id,
                danceStyle: 'Jazz',
                isPublic: true
            },
            {
                title: 'Latin Dance for Joy',
                description: 'Uplifting salsa and bachata moves to boost your mood.',
                videoUrl: 'https://res.cloudinary.com/demo/video/upload/sample.mp4',
                thumbnail: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
                author: member4._id,
                danceStyle: 'Latin',
                isPublic: true
            },
            {
                title: 'Modern Dance Meditation',
                description: 'Mindful modern dance practice for mental clarity.',
                videoUrl: 'https://res.cloudinary.com/demo/video/upload/sample.mp4',
                thumbnail: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
                author: member5._id,
                danceStyle: 'Modern',
                isPublic: true
            }
        ]);

        console.log('✅ Videos created successfully');

        // Create Bookings
        console.log('Creating bookings...');

        const bookings = await Booking.create([
            {
                user: member1._id,
                eventName: 'Hip Hop Workshop',
                eventDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                eventTime: '18:00',
                location: 'Studio A',
                status: 'confirmed',
                notes: 'Looking forward to this!'
            },
            {
                user: member2._id,
                eventName: 'Ballet Class',
                eventDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
                eventTime: '10:00',
                location: 'Studio B',
                status: 'pending',
                notes: 'First time attending'
            },
            {
                user: member3._id,
                eventName: 'Jazz Improvisation',
                eventDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
                eventTime: '16:00',
                location: 'Main Hall',
                status: 'confirmed',
                notes: ''
            }
        ]);

        console.log('✅ Bookings created successfully');

        // Summary
        console.log('\n=================================');
        console.log('✅ Database seeding completed!');
        console.log('=================================');
        console.log(`Users created: ${await User.countDocuments()}`);
        console.log(`  - Admins: ${await User.countDocuments({ role: 'admin' })}`);
        console.log(`  - Members: ${await User.countDocuments({ role: 'member' })}`);
        console.log(`  - Pending: ${await User.countDocuments({ role: 'pending' })}`);
        console.log(`MindTalk posts: ${await MindTalk.countDocuments()}`);
        console.log(`Videos: ${await Video.countDocuments()}`);
        console.log(`Bookings: ${await Booking.countDocuments()}`);
        console.log('=================================\n');

        console.log('Login credentials:');
        console.log('Admin: admin@d4c.com / admin123');
        console.log('Member: sarah@d4c.com / member123');
        console.log('=================================\n');

        process.exit(0);

    } catch (error) {
        console.error('❌ Error seeding database:', error);
        console.error('Error details:', error.message);
        if (error.stack) {
            console.error('Stack trace:', error.stack);
        }
        process.exit(1);
    }
};

// Run the seeder
seedDatabase();