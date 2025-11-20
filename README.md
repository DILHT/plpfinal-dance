# Dance For Change - D4C

A community-driven platform promoting mental health and well-being through dance.

## 🎯 Project Overview

Dance For Change (D4C) is an MVP platform that aligns with SDG 3 (Good Health & Well-being) and SDG 8 (Decent Work). The platform features a Mental Health Room (MindTalk) where approved members can anonymously share their thoughts.

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or MongoDB Atlas)
- Cloudinary account (for media uploads)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/DILHT/plpfinal-dance.git
   cd plpfinal-dance
   ```

2. **Install Backend Dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Set up Environment Variables**

   Create a `.env` file in the `server` directory:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/d4c
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   CLIENT_URL=http://localhost:5173
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   ```

### Running the Project

1. **Start MongoDB** (if using local MongoDB)
   ```bash
   mongod
   ```

2. **Start the Backend Server**
   ```bash
   cd server
   npm run dev
   ```
   Server will run on `http://localhost:5000`

3. **Start the Frontend Development Server**
   ```bash
   cd client
   npm run dev
   ```
   Frontend will run on `http://localhost:5173`

## 📁 Project Structure

```
plpfinal-dance/
├── server/                 # Backend (Express + MongoDB)
│   ├── config/            # Configuration files
│   ├── controllers/       # Route controllers
│   ├── middlewares/       # Auth & error handlers
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   └── utils/             # Utility functions
├── client/                # Frontend (React 19 + Vite)
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── contexts/      # React contexts
│   │   ├── hooks/         # Custom hooks
│   │   ├── pages/         # Page components
│   │   └── services/      # API services
└── README.md
```

## ✨ Features

### Public Pages (No Login Required)
- **Home Page**: Hero section, description, call-to-action
- **About Us**: Mission, vision, mental health impact
- **Room Preview**: View anonymous posts (read-only)
- **Join D4C Form**: Request to join the club
- **View Dancers**: Display approved dancers

### Authentication & Approval System
- **User Roles**: visitor, pending, member, admin
- **Status System**: pending, approved, rejected
- **Login Restrictions**: Only approved members can log in
- **Pending Message**: "Your application is under review"

### MindTalk Room
- Anonymous posting for approved members
- Categories: anxiety, depression, stress, motivation, gratitude, general
- Reactions and comments (members only)
- Public read-only access

### Media Upload
- Multer + Cloudinary integration
- Video and image uploads
- Profile picture support

### Admin Dashboard
- View pending users
- Approve/Reject users
- Delete posts and videos
- View bookings

## 🛠️ Tech Stack

### Backend
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- Multer + Cloudinary
- bcryptjs

### Frontend
- React 19
- Vite
- Tailwind CSS v4
- shadcn UI
- React Router
- Axios
- TanStack Query

## 📝 API Endpoints

### Authentication
- `POST /api/auth/join` - Join D4C (register)
- `POST /api/auth/login` - Login (members only)
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users/dancers` - Get approved dancers (public)
- `GET /api/users/pending` - Get pending users (admin)
- `PUT /api/users/:userId/approve` - Approve user (admin)
- `PUT /api/users/:userId/reject` - Reject user (admin)
- `PUT /api/users/profile` - Update profile (member)

### MindTalk
- `GET /api/mindtalk` - Get all posts (public)
- `POST /api/mindtalk` - Create post (member)
- `POST /api/mindtalk/:postId/reactions` - Add reaction (member)
- `POST /api/mindtalk/:postId/comments` - Add comment (member)
- `DELETE /api/mindtalk/:postId` - Delete post (admin)

### Videos
- `GET /api/videos` - Get all videos (public)
- `POST /api/videos` - Upload video (member)
- `DELETE /api/videos/:videoId` - Delete video (admin)

## 🎨 Theme System

The project includes a dark/light theme toggle system:
- `useTheme` hook
- `ThemeContext` and `ThemeProvider`
- Persistent theme preference in localStorage
- OS preference detection

## 📄 License

This project is part of a final project assignment.

## 👤 Author

DILHT
