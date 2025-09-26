# 🚀 Deployment Guide

This guide will walk you through deploying your ScraBBly Frame to production.

## Prerequisites

- Node.js 18+ installed
- A Supabase account
- A Vercel account (or your preferred hosting platform)
- Git repository set up

## Step 1: Set up Supabase Database

### 1.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Choose your organization and enter project details
4. Wait for the project to be created

### 1.2 Set up Database Schema

1. Go to the SQL Editor in your Supabase dashboard
2. Copy the contents of `supabase-schema.sql`
3. Paste and run the SQL script
4. Verify the tables were created successfully

### 1.3 Get API Keys

1. Go to Settings > API in your Supabase dashboard
2. Copy the following values:
   - Project URL
   - Anon public key
   - Service role key (keep this secret!)

## Step 2: Deploy to Vercel

### 2.1 Prepare Your Code

1. Push your code to GitHub/GitLab
2. Make sure all files are committed

### 2.2 Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign up/login
2. Click "New Project"
3. Import your Git repository
4. Configure the project:
   - Framework Preset: Next.js
   - Root Directory: `scrabbly-frame` (if in subfolder)
   - Build Command: `npm run build`
   - Output Directory: `.next`

### 2.3 Set Environment Variables

In Vercel dashboard, go to your project > Settings > Environment Variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

### 2.4 Deploy

1. Click "Deploy"
2. Wait for deployment to complete
3. Your frame will be available at: `https://your-app.vercel.app/api/frame`

## Step 3: Test Your Frame

### 3.1 Test the Frame URL

Visit your frame URL in a browser to see the HTML output.

### 3.2 Test in Farcaster

1. Create a cast with your frame URL
2. The frame should appear with interactive buttons
3. Test all functionality:
   - New Game button
   - Word submission
   - Leaderboard
   - Next Puzzle

## Step 4: Alternative Deployment Options

### Netlify

1. Connect your Git repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `.next`
4. Add environment variables in Netlify dashboard
5. Deploy

### Railway

1. Connect your Git repository to Railway
2. Railway will auto-detect Next.js
3. Add environment variables in Railway dashboard
4. Deploy

### Self-Hosted

1. Run `npm run build`
2. Run `npm start`
3. Set up reverse proxy (nginx/Apache)
4. Configure SSL certificate
5. Point your domain to the server

## Step 5: Frame Integration

### 5.1 Frame URL Format

Your frame URL should be:
```
https://your-domain.com/api/frame
```

### 5.2 Testing Frame in Casts

1. Create a cast with your frame URL
2. The frame should render with:
   - Game image showing letters
   - Interactive buttons
   - Text input for word submission

### 5.3 Frame Protocol Compliance

The frame follows Farcaster Frames vNext specification:
- Uses proper meta tags
- Handles button interactions
- Supports text input
- Returns proper HTML responses

## Troubleshooting

### Common Issues

1. **Frame not loading**: Check environment variables and frame URL
2. **Database connection errors**: Verify Supabase credentials
3. **Build failures**: Check for TypeScript errors and missing dependencies
4. **Image generation issues**: Ensure all API routes are working

### Debug Steps

1. Check Vercel function logs
2. Test API endpoints directly
3. Verify environment variables
4. Check Supabase connection
5. Test frame URL in browser

### Performance Optimization

1. Enable Vercel Edge Functions for faster response times
2. Use Supabase connection pooling
3. Implement caching for dictionary API calls
4. Optimize image generation

## Monitoring

### Set up Monitoring

1. **Vercel Analytics**: Enable in Vercel dashboard
2. **Supabase Monitoring**: Check database performance
3. **Error Tracking**: Consider Sentry or similar
4. **Uptime Monitoring**: Use UptimeRobot or similar

### Key Metrics to Track

- Frame load times
- API response times
- Database query performance
- Error rates
- User engagement

## Security Considerations

1. **Environment Variables**: Never commit secrets to Git
2. **API Rate Limiting**: Implement rate limiting for API calls
3. **Input Validation**: Sanitize all user inputs
4. **CORS**: Configure CORS properly
5. **HTTPS**: Always use HTTPS in production

## Scaling

### When to Scale

- High user traffic
- Slow response times
- Database performance issues
- High error rates

### Scaling Options

1. **Vercel Pro**: Higher limits and better performance
2. **Supabase Pro**: Better database performance
3. **CDN**: Use Cloudflare or similar
4. **Caching**: Implement Redis caching
5. **Load Balancing**: For self-hosted solutions

## Maintenance

### Regular Tasks

1. **Update Dependencies**: Keep packages updated
2. **Monitor Performance**: Check metrics regularly
3. **Backup Database**: Regular Supabase backups
4. **Security Updates**: Apply security patches
5. **User Feedback**: Monitor and respond to issues

### Updates

1. **Code Updates**: Deploy through Git
2. **Database Migrations**: Use Supabase migrations
3. **Environment Changes**: Update in hosting platform
4. **Feature Rollouts**: Use feature flags if needed

## Support

If you encounter issues:

1. Check this deployment guide
2. Review the main README.md
3. Check Vercel/Supabase documentation
4. Open an issue in the repository
5. Contact the development team

---

Happy deploying! 🚀
