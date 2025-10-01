#!/usr/bin/env node

/**
 * Quick Supabase Setup Helper
 * Run this script to test your Supabase connection
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function testSupabaseConnection() {
  console.log('🔍 Testing Supabase connection...\n');

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing environment variables!');
    console.log('Please create a .env.local file with:');
    console.log('NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co');
    console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here');
    console.log('SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here\n');
    process.exit(1);
  }

  if (supabaseUrl.includes('placeholder') || supabaseKey.includes('placeholder')) {
    console.error('❌ You are still using placeholder values!');
    console.log('Please update your .env.local file with real Supabase credentials.\n');
    process.exit(1);
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Test basic connection
    console.log('📡 Testing connection...');
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .limit(1);

    if (error) {
      console.error('❌ Connection failed:', error.message);
      console.log('\n🔧 Troubleshooting:');
      console.log('1. Make sure your Supabase project is running');
      console.log('2. Check that you ran the schema setup (supabase-schema.sql)');
      console.log('3. Verify your environment variables are correct\n');
      process.exit(1);
    }

    console.log('✅ Supabase connection successful!');
    console.log(`📊 Database URL: ${supabaseUrl}`);
    console.log('🎮 ScraBBly is ready to use real data!\n');

    // Test leaderboard query
    console.log('🏆 Testing leaderboard query...');
    const { data: leaderboard, error: leaderboardError } = await supabase
      .from('leaderboard_view')
      .select('*')
      .limit(5);

    if (leaderboardError) {
      console.log('⚠️  Leaderboard view not found. Make sure you ran the schema setup.');
    } else {
      console.log(`✅ Leaderboard query successful! Found ${leaderboard.length} entries.`);
    }

    console.log('\n🚀 Setup complete! Your game will now use real Supabase data.');
    console.log('📝 Next steps:');
    console.log('1. Deploy to Vercel with environment variables');
    console.log('2. Test the game with real Farcaster users');
    console.log('3. Monitor your Supabase dashboard for data\n');

  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
    process.exit(1);
  }
}

// Run the test
testSupabaseConnection();
