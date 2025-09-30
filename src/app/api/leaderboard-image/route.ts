// API endpoint to generate leaderboard images for Farcaster Frame
import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'weekly'; // weekly or alltime
    
    // Mock leaderboard data based on type
    const leaderboard = type === 'weekly' ? generateWeeklyLeaderboard() : generateAllTimeLeaderboard();
    
    // Generate SVG image
    const svg = generateLeaderboardImage(leaderboard, type);
    
    return new NextResponse(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Leaderboard image generation error:', error);
    return new NextResponse('Error generating image', { status: 500 });
  }
}

function generateWeeklyLeaderboard() {
  return [
    { display_name: 'WordMaster', weekly_score: 2847, puzzles_solved: 45 },
    { display_name: 'ScrabbleKing', weekly_score: 2634, puzzles_solved: 42 },
    { display_name: 'Lexicon', weekly_score: 2456, puzzles_solved: 38 },
    { display_name: 'WordSmith', weekly_score: 2234, puzzles_solved: 35 },
    { display_name: 'PuzzlePro', weekly_score: 2156, puzzles_solved: 34 },
    { display_name: 'LetterLover', weekly_score: 1987, puzzles_solved: 31 },
    { display_name: 'BrainTeaser', weekly_score: 1876, puzzles_solved: 29 },
    { display_name: 'WordWizard', weekly_score: 1765, puzzles_solved: 28 },
    { display_name: 'ScrambleStar', weekly_score: 1654, puzzles_solved: 26 },
    { display_name: 'VocabVault', weekly_score: 1543, puzzles_solved: 24 }
  ];
}

function generateAllTimeLeaderboard() {
  return [
    { display_name: 'WordMaster', total_score: 52847, puzzles_solved: 845 },
    { display_name: 'ScrabbleKing', total_score: 51634, puzzles_solved: 812 },
    { display_name: 'Lexicon', total_score: 50456, puzzles_solved: 798 },
    { display_name: 'WordSmith', total_score: 49234, puzzles_solved: 775 },
    { display_name: 'PuzzlePro', total_score: 48156, puzzles_solved: 754 },
    { display_name: 'LetterLover', total_score: 46987, puzzles_solved: 731 },
    { display_name: 'BrainTeaser', total_score: 45876, puzzles_solved: 719 },
    { display_name: 'WordWizard', total_score: 44765, puzzles_solved: 698 },
    { display_name: 'ScrambleStar', total_score: 43654, puzzles_solved: 676 },
    { display_name: 'VocabVault', total_score: 42543, puzzles_solved: 654 }
  ];
}

function generateLeaderboardImage(leaderboard: any[], type: string = 'weekly') {
  const entries = leaderboard.slice(0, 10); // Show top 10
  
  const entriesSvg = entries.map((entry, index) => {
    const y = 70 + (index * 32);
    const medal = index < 3 ? ['🥇', '🥈', '🥉'][index] : '';
    const rankColor = index < 3 ? '#FFD700' : index < 10 ? '#C0C0C0' : '#CD7F32';
    const score = type === 'weekly' ? entry.weekly_score : entry.total_score;
    const scoreLabel = type === 'weekly' ? 'pts' : 'pts';
    
    return `
      <rect x="15" y="${y - 12}" width="370" height="26" fill="rgba(255,255,255,0.08)" rx="4"/>
      <text x="25" y="${y - 2}" font-family="Arial, sans-serif" font-size="14" fill="${rankColor}">${medal} ${index + 1}.</text>
      <text x="65" y="${y - 2}" font-family="Arial, sans-serif" font-size="13" fill="white">${entry.display_name}</text>
      <text x="200" y="${y - 2}" font-family="Arial, sans-serif" font-size="11" fill="rgba(255,255,255,0.7)">${entry.puzzles_solved} puzzles</text>
      <text x="360" y="${y - 2}" text-anchor="end" font-family="Arial, sans-serif" font-size="13" font-weight="bold" fill="#4ecdc4">${score.toLocaleString()}</text>
    `;
  }).join('');

  return `
    <svg width="400" height="420" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
        </linearGradient>
      </defs>
      
      <rect width="400" height="420" fill="url(#bg)"/>
      
      <!-- Title -->
      <text x="200" y="35" text-anchor="middle" font-family="Arial, sans-serif" font-size="22" font-weight="bold" fill="white">🏆 ScraBBly ${type === 'weekly' ? 'Weekly' : 'All-Time'} Leaderboard</text>
      
      <!-- Header -->
      <text x="200" y="55" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="rgba(255,255,255,0.8)">${type === 'weekly' ? 'This Week\'s Top Players' : 'Top Players of All Time'}</text>
      
      <!-- Entries -->
      ${entriesSvg}
      
      <!-- Footer -->
      <text x="200" y="400" text-anchor="middle" font-family="Arial, sans-serif" font-size="11" fill="rgba(255,255,255,0.7)">Play to climb the ranks!</text>
    </svg>
  `;
}
