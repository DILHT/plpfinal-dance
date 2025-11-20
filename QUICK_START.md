# Quick Start Guide

## 🚀 How to Run the Project

### Step 1: Install Dependencies (if not done)

**Backend:**
```powershell
cd server
npm install --legacy-peer-deps
```

**Frontend:**
```powershell
cd client
npm install
```

### Step 2: Set Up Environment Variables

Create a `.env` file in the `server` folder:

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

**Note:** For Cloudinary, sign up at https://cloudinary.com and get your credentials from the dashboard.

### Step 3: Start MongoDB

Make sure MongoDB is running on your system. If using MongoDB Atlas, update the `MONGODB_URI` in `.env`.

### Step 4: Run the Servers

**Terminal 1 - Backend Server:**
```powershell
cd server
npm run dev
```
Server runs on: `http://localhost:5000`

**Terminal 2 - Frontend Server:**
```powershell
cd client
npm run dev
```
Frontend runs on: `http://localhost:5173`

### Step 5: Open in Browser

Navigate to: `http://localhost:5173`

## 📝 First Steps

1. **Join D4C**: Click "Join D4C" and fill out the form
2. **Wait for Approval**: Your status will be "pending"
3. **Admin Approval**: An admin needs to approve your account
4. **Login**: Once approved, you can log in and access member features

## 🔑 Creating an Admin User

To create an admin user, you can either:
- Manually update the database to set a user's role to "admin" and status to "approved"
- Or use MongoDB Compass/CLI to update the user document

Example MongoDB update:
```javascript
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin", status: "approved" } }
)
```

## 🎨 Features to Test

- ✅ Home page with hero section
- ✅ About page
- ✅ Join D4C form
- ✅ View dancers (public)
- ✅ MindTalk room (read-only for public, full access for members)
- ✅ Video uploads (members only)
- ✅ Admin dashboard (admin only)
- ✅ Dark/Light theme toggle

## 🐛 Troubleshooting

**Port already in use:**
- Change PORT in server/.env
- Or change Vite port in client/vite.config.js

**MongoDB connection error:**
- Check if MongoDB is running
- Verify MONGODB_URI in .env

**Cloudinary errors:**
- Verify your Cloudinary credentials
- Check that the cloud name, API key, and secret are correct

**Module not found errors:**
- Delete node_modules and package-lock.json
- Run `npm install` again

