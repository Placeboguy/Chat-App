# Deployment Guide - Vercel

This guide will help you deploy your chat application to Vercel.

## Prerequisites

1. Vercel account (sign up at https://vercel.com)
2. GitHub repository with your code
3. MongoDB Atlas database
4. Cloudinary account

## Step 1: Prepare for Deployment

### Backend (Server) Configuration

1. Your server is already configured for Vercel with:
   - Conditional server startup for production
   - Proper CORS configuration
   - Environment variable handling

### Frontend (Client) Configuration

1. Build configuration is already set in `vite.config.js`
2. Vercel configuration exists in `client/vercel.json`

## Step 2: Deploy to Vercel

### Method 1: Vercel CLI (Recommended)

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy backend:
   ```bash
   cd server
   vercel
   ```
   - Choose "Link to existing project" or create new
   - Set environment variables when prompted
   - Note the deployment URL

3. Deploy frontend:
   ```bash
   cd client
   vercel
   ```
   - Update `VITE_SERVER_URL` to your backend URL
   - Deploy

### Method 2: Vercel Dashboard

1. Go to https://vercel.com/dashboard
2. Click "New Project"
3. Import your GitHub repository
4. Deploy backend first:
   - Set root directory to `server`
   - Add environment variables
5. Deploy frontend:
   - Set root directory to `client`
   - Add `VITE_SERVER_URL` environment variable

## Step 3: Environment Variables

### Backend Environment Variables
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### Frontend Environment Variables
```
VITE_SERVER_URL=https://your-backend-deployment.vercel.app
```

## Step 4: Custom Domain (Optional)

1. In Vercel dashboard, go to your project
2. Click "Domains" tab
3. Add your custom domain
4. Update DNS settings as instructed

## Troubleshooting

### Common Issues:

1. **CORS Errors**: Ensure your backend URL is correctly set in frontend
2. **Environment Variables**: Double-check all environment variables are set
3. **Database Connection**: Verify MongoDB URI is correct
4. **Function Timeout**: Vercel has a 10-second timeout for Hobby plans

### Vercel-Specific Considerations:

1. **Function Duration**: Free tier has 10s timeout limit
2. **Static Files**: Handled automatically
3. **Environment Variables**: Set through dashboard or CLI
4. **Custom Headers**: Configured via `vercel.json`

## Monitoring

1. Use Vercel dashboard for deployment logs
2. Check function logs for runtime errors
3. Monitor MongoDB Atlas for database connections
4. Use browser dev tools for client-side debugging

## Production URLs

After deployment, your application will be available at:
- Frontend: `https://your-app-name.vercel.app`
- Backend: `https://your-api-name.vercel.app`

Update the `VITE_SERVER_URL` in your frontend environment variables to match your backend URL.