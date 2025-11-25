# Environment Variables Setup Guide

This document outlines all sensitive data and environment variables required for the Dance For Change (D4C) project.

## ⚠️ SECURITY WARNING

**NEVER commit `.env` files to version control!** They contain sensitive information like database credentials, API keys, and secrets.

The `.gitignore` file is already configured to exclude `.env` files, but always double-check before committing.

---

## 📁 Backend Environment Variables (`server/.env`)

### Required Variables

#### 1. **Server Configuration**
```env
PORT=5000
NODE_ENV=development
```
- `PORT`: Backend server port (default: 5000)
- `NODE_ENV`: Environment mode (`development`, `production`, or `test`)

#### 2. **Database Configuration** 🔒 SENSITIVE
```env
MONGODB_URI=mongodb://localhost:27017/d4c
```
- **SENSITIVE**: Contains database credentials
- **Local**: `mongodb://localhost:27017/d4c`
- **With Auth**: `mongodb://user:password@localhost:27017/d4c?authSource=admin`
- **MongoDB Atlas**: `mongodb+srv://username:password@cluster.mongodb.net/d4c?retryWrites=true&w=majority`

#### 3. **JWT Secret** 🔒 CRITICAL
```env
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```
- **CRITICAL**: Used to sign and verify authentication tokens
- **MUST** be a long, random, secure string in production
- **Generate secure secret**: `openssl rand -base64 32`
- **NEVER** use the default fallback value in production!

#### 4. **Client URL** (CORS & Socket.io)
```env
CLIENT_URL=http://localhost:5173
```
- Frontend URL for CORS configuration
- Development: `http://localhost:5173`
- Production: `https://yourdomain.com`

#### 5. **Cloudinary Configuration** 🔒 SENSITIVE
```env
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
```
- **SENSITIVE**: Used for image and video uploads
- Get credentials from: https://cloudinary.com/console
- Sign up for a free account if needed
- **KEEP API_SECRET secure!**

---

## 📁 Frontend Environment Variables (`client/.env`)

### Required Variables

#### 1. **API Configuration**
```env
VITE_API_URL=http://localhost:5000
```
- Backend API URL
- Development: `http://localhost:5000`
- Production: `https://api.yourdomain.com`
- Note: In production with same domain, can use relative paths: `/api`

#### 2. **Socket.io Configuration** (Optional)
```env
VITE_SOCKET_URL=http://localhost:5000
```
- Socket.io server URL (usually same as API URL)
- Used for real-time features like MindTalk updates
- If not set, defaults to `http://localhost:5000`

### Important Notes for Frontend

1. **All Vite env variables must be prefixed with `VITE_`**
2. **Access in code**: `import.meta.env.VITE_API_URL`
3. **These variables are exposed to the client** (not secret)
4. **Never put secrets in frontend .env files**
5. For production, set these in your hosting platform's environment variables

---

## 🚀 Setup Instructions

### Backend Setup

1. Navigate to the `server` directory:
   ```bash
   cd server
   ```

2. Copy the example file:
   ```bash
   cp .env.example .env
   ```

3. Open `.env` and fill in your actual values:
   - Replace `MONGODB_URI` with your MongoDB connection string
   - Generate a secure `JWT_SECRET` (use `openssl rand -base64 32`)
   - Add your Cloudinary credentials
   - Update `CLIENT_URL` for your environment

### Frontend Setup

1. Navigate to the `client` directory:
   ```bash
   cd client
   ```

2. Copy the example file:
   ```bash
   cp .env.example .env
   ```

3. Open `.env` and fill in your actual values:
   - Set `VITE_API_URL` to your backend URL
   - Optionally set `VITE_SOCKET_URL` if different

---

## 🔐 Security Best Practices

### 1. **Never Commit .env Files**
- ✅ `.env` is already in `.gitignore`
- ✅ Always use `.env.example` as a template
- ❌ Never commit actual credentials

### 2. **Use Strong Secrets**
- Generate JWT_SECRET: `openssl rand -base64 32`
- Use unique values for each environment
- Rotate secrets periodically

### 3. **Environment-Specific Values**
- Use different values for development, staging, and production
- Never use production secrets in development

### 4. **Production Recommendations**
- Use a secrets manager (AWS Secrets Manager, Azure Key Vault, etc.)
- Use environment variables in your hosting platform
- Enable database authentication
- Use HTTPS in production
- Regularly rotate API keys and secrets

### 5. **Cloudinary Security**
- Use signed uploads for sensitive content
- Set up upload presets with restrictions
- Monitor API usage
- Rotate API keys periodically

---

## 📋 Quick Reference

### Backend (.env)
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/d4c
JWT_SECRET=your-secret-here
CLIENT_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

---

## 🆘 Troubleshooting

### Backend Issues

**"MongoDB connection failed"**
- Check `MONGODB_URI` is correct
- Verify MongoDB is running
- Check network/firewall settings

**"JWT verification failed"**
- Ensure `JWT_SECRET` matches between server restarts
- Don't use default fallback in production

**"CORS error"**
- Verify `CLIENT_URL` matches your frontend URL
- Check for trailing slashes

### Frontend Issues

**"API calls failing"**
- Verify `VITE_API_URL` is correct
- Check backend is running
- Ensure CORS is configured

**"Socket.io not connecting"**
- Check `VITE_API_URL` or `VITE_SOCKET_URL`
- Verify backend Socket.io is initialized
- Check browser console for errors

---

## 📝 Example .env Files

See `.env.example` files in both `server/` and `client/` directories for complete examples with documentation.

---

**Remember**: Keep your `.env` files secure and never commit them to version control!

