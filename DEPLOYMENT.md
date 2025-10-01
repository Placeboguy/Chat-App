# Render Deployment Guide

## 🚀 Backend Deployment Steps

### 1. Create MongoDB Atlas Database
1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Create a new cluster (free tier available)
3. Create a database user with read/write permissions
4. Get your connection string:
   - Click "Connect" → "Connect your application"
   - Copy the connection string
   - **Format**: `mongodb+srv://username:password@cluster.mongodb.net/databasename`

### 2. Get Cloudinary Credentials
1. Go to [Cloudinary](https://cloudinary.com/)
2. Sign up/Login to your dashboard
3. Get your credentials:
   - Cloud Name
   - API Key
   - API Secret

### 3. Deploy to Render
1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository: `fullstack-chat234243`
4. Configure:
   - **Name**: `chat-app-backend`
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

### 4. Add Environment Variables in Render
Go to your service → Environment tab and add:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/chat-app
JWT_SECRET=your-super-secret-jwt-key-here
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
NODE_ENV=production
```

### 5. Deploy Frontend
1. Create another service: "Static Site"
2. **Root Directory**: `client`
3. **Build Command**: `npm install && npm run build`
4. **Publish Directory**: `dist`

### 6. Update CORS Settings
After both services are deployed, update the URLs in:
- `server/server.js` (CORS origins)
- `client/.env.production` (backend URL)

## ⚠️ Common Issues

### MongoDB Connection Error
- Ensure your connection string starts with `mongodb://` or `mongodb+srv://`
- Don't append `/chat-app` to the URI if it's already in the connection string
- Check that your database user has proper permissions
- Verify IP whitelist includes `0.0.0.0/0` for Render

### Environment Variables
- All environment variables must be set in Render dashboard
- No quotes needed around values in Render environment variables
- Double-check spelling and case sensitivity

### Build Errors
- Ensure all dependencies are in `package.json`
- Check that your repository structure matches the configuration
- Verify the root directory is set correctly

## 🔗 Useful Links
- [Render Documentation](https://render.com/docs)
- [MongoDB Atlas](https://cloud.mongodb.com/)
- [Cloudinary](https://cloudinary.com/)