# 🗄️ Supabase Setup Guide for ScraBBly

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign in with GitHub (recommended)
4. Click "New Project"
5. Fill in:
   - **Name**: `scrabbly-frame`
   - **Database Password**: Generate a strong password (save it!)
   - **Region**: Choose closest to your users
6. Click "Create new project"
7. Wait 2-3 minutes for setup to complete

## Step 2: Get Your Credentials

Once your project is ready:

1. Go to **Settings** → **API**
2. Copy these values:
   - **Project URL**: `https://your-project-id.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - **service_role key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (secret!)

## Step 3: Set Up Database Schema

1. Go to **SQL Editor** in your Supabase dashboard
2. Click "New query"
3. Copy and paste the contents of `supabase-schema.sql`
4. Click "Run" to create all tables and views

## Step 4: Configure Environment Variables

### For Local Development:
Create a `.env.local` file in your project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### For Vercel Deployment:
1. Go to your Vercel project dashboard
2. Click **Settings** → **Environment Variables**
3. Add these variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_APP_URL` (your Vercel URL)

## Step 5: Test the Connection

1. Run `npm run dev` locally
2. Visit your game frame
3. Check Supabase dashboard → **Table Editor** to see if data is being created

## Step 6: Production Setup

1. **Row Level Security (RLS)**:
   ```sql
   -- Enable RLS on all tables
   ALTER TABLE users ENABLE ROW LEVEL SECURITY;
   ALTER TABLE puzzles ENABLE ROW LEVEL SECURITY;
   ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;
   
   -- Create policies for public read access
   CREATE POLICY "Public read access" ON puzzles FOR SELECT USING (true);
   CREATE POLICY "Public read access" ON leaderboard_view FOR SELECT USING (true);
   ```

2. **Authentication**: Farcaster handles user auth, so we use service role for writes

## 🔒 Security Notes

- **anon key**: Safe for client-side, read-only operations
- **service_role key**: Server-side only, full database access (keep secret!)
- **RLS**: Ensures users can only access their own data

## 🚀 Benefits After Setup

- ✅ Real user authentication via Farcaster
- ✅ Persistent leaderboards with actual data
- ✅ User statistics and game history
- ✅ Puzzle analytics and optimization
- ✅ Real-time rankings and competitions
