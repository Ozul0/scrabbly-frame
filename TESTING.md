# 🧪 ScraBBly Frame Testing Guide

This guide will help you test your ScraBBly Frame at different levels, from local development to full Farcaster integration.

## Method 1: Quick Local Testing (No Setup Required)

### Test the HTML Interface
1. Open `test-local.html` in your browser
2. This provides a visual interface to test:
   - Puzzle generation
   - Word validation logic
   - Frame HTML generation
   - Image URL generation

### Test API Endpoints
1. Start the development server:
   ```bash
   npm run dev
   ```

2. Run the API test script:
   ```bash
   node test-api.js
   ```

## Method 2: Full Local Development Testing

### Prerequisites
- Node.js 18+ installed
- Basic understanding of environment variables

### Step 1: Set up Environment Variables
Create a `.env.local` file:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Start Development Server
```bash
npm run dev
```

### Step 4: Test Individual Components

#### Test Main Page
- Visit: `http://localhost:3000`
- Should show ScraBBly branding and instructions

#### Test Frame Endpoint
- Visit: `http://localhost:3000/api/frame`
- Should show HTML with frame meta tags

#### Test Game Image
- Visit: `http://localhost:3000/api/game-image?letters=CATSER&score=0&found=`
- Should show SVG image with letters in circle

#### Test Leaderboard Image
- Visit: `http://localhost:3000/api/leaderboard-image`
- Should show SVG leaderboard image

## Method 3: Frame-Specific Testing

### Test Frame HTML Structure
1. Open browser developer tools
2. Visit `http://localhost:3000/api/frame`
3. Check for required meta tags:
   - `fc:frame` content="vNext"
   - `fc:frame:image` with image URL
   - `fc:frame:button:*` for each button
   - `fc:frame:input:text` for text input
   - `fc:frame:post_url` for form submission

### Test Frame Interactions
1. Use browser developer tools to simulate button clicks
2. Test form submission with different inputs
3. Verify proper error handling

## Method 4: Farcaster Frame Testing Tools

### Using Frame Validator Tools

#### Option 1: Frame Validator (Online)
1. Go to [Frame Validator](https://warpcast.com/~/developers/frames)
2. Enter your frame URL: `http://localhost:3000/api/frame`
3. Test all buttons and interactions

#### Option 2: Local Frame Testing
1. Use tools like [Frame Test](https://frame-test.vercel.app/)
2. Enter your frame URL
3. Test button interactions and form submissions

### Test Frame in Warpcast
1. Deploy your frame to production (Vercel/Netlify)
2. Create a cast with your frame URL
3. Test all functionality in the actual Farcaster app

## Method 5: Production Testing

### Deploy to Vercel
1. Push code to GitHub
2. Connect to Vercel
3. Add environment variables
4. Deploy

### Test Production URLs
- Frame URL: `https://your-app.vercel.app/api/frame`
- Game Image: `https://your-app.vercel.app/api/game-image?letters=CATSER&score=0&found=`
- Leaderboard: `https://your-app.vercel.app/api/leaderboard-image`

## Method 6: Database Testing (Optional)

### Set up Supabase
1. Create Supabase project
2. Run `supabase-schema.sql`
3. Get API keys
4. Update environment variables

### Test Database Functions
1. Test user creation
2. Test game session saving
3. Test leaderboard queries
4. Test puzzle storage

## Common Issues and Solutions

### Issue: Frame not loading
**Solution:**
- Check environment variables
- Verify frame URL is correct
- Check browser console for errors

### Issue: Images not generating
**Solution:**
- Verify image endpoint URLs
- Check SVG generation code
- Test with different parameters

### Issue: Database connection errors
**Solution:**
- Verify Supabase credentials
- Check database schema
- Test with fallback data

### Issue: Word validation not working
**Solution:**
- Check dictionary API connection
- Verify fallback word list
- Test with known valid words

## Testing Checklist

### Basic Functionality
- [ ] Main page loads correctly
- [ ] Frame HTML generates properly
- [ ] Game images render correctly
- [ ] Leaderboard images render correctly
- [ ] All API endpoints respond

### Frame Compliance
- [ ] Proper meta tags present
- [ ] Buttons work correctly
- [ ] Text input functions
- [ ] Form submission works
- [ ] Error handling works

### Game Logic
- [ ] Puzzle generation works
- [ ] Word validation functions
- [ ] Scoring system works
- [ ] Center letter rule enforced
- [ ] Bonus points calculated correctly

### Production Ready
- [ ] Deploys successfully
- [ ] Environment variables set
- [ ] Database connected (if using)
- [ ] Performance acceptable
- [ ] Error handling robust

## Advanced Testing

### Load Testing
- Test with multiple concurrent users
- Verify performance under load
- Check database query optimization

### Security Testing
- Test input validation
- Check for SQL injection
- Verify CORS settings
- Test rate limiting

### Cross-Platform Testing
- Test on different devices
- Verify mobile compatibility
- Check different browsers
- Test with various screen sizes

## Debugging Tips

### Enable Debug Mode
Set `NODE_ENV=development` to see detailed logs

### Check Logs
- Vercel function logs
- Browser console errors
- Network request failures

### Common Debug Commands
```bash
# Check if server is running
curl http://localhost:3000

# Test specific endpoint
curl -X POST http://localhost:3000/api/frame -H "Content-Type: application/json" -d '{"untrustedData":{"fid":123,"buttonIndex":1}}'

# Check environment variables
echo $NEXT_PUBLIC_SUPABASE_URL
```

## Need Help?

If you encounter issues:
1. Check this testing guide
2. Review the main README.md
3. Check browser console for errors
4. Verify all environment variables
5. Test with the provided test files

---

Happy testing! 🎯
