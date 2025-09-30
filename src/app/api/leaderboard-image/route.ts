// API endpoint to generate leaderboard images for Farcaster Frame
import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Mock leaderboard data for testing - replace with real database query
    const leaderboard = [
      { display_name: 'WordMaster', total_score: 2847, puzzles_solved: 45 },
      { display_name: 'ScrabbleKing', total_score: 2634, puzzles_solved: 42 },
      { display_name: 'Lexicon', total_score: 2456, puzzles_solved: 38 },
      { display_name: 'WordSmith', total_score: 2234, puzzles_solved: 35 },
      { display_name: 'PuzzlePro', total_score: 2156, puzzles_solved: 34 },
      { display_name: 'LetterLover', total_score: 1987, puzzles_solved: 31 },
      { display_name: 'BrainTeaser', total_score: 1876, puzzles_solved: 29 },
      { display_name: 'WordWizard', total_score: 1765, puzzles_solved: 28 },
      { display_name: 'ScrambleStar', total_score: 1654, puzzles_solved: 26 },
      { display_name: 'VocabVault', total_score: 1543, puzzles_solved: 24 }
    ];
    
    // Generate SVG image
    const svg = generateLeaderboardImage(leaderboard);
    
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

function generateLeaderboardImage(leaderboard: any[]) {
  const entries = leaderboard.slice(0, 10); // Show top 10
  
  const entriesSvg = entries.map((entry, index) => {
    const y = 70 + (index * 32);
    const medal = index < 3 ? ['🥇', '🥈', '🥉'][index] : '';
    const rankColor = index < 3 ? '#FFD700' : index < 10 ? '#C0C0C0' : '#CD7F32';
    
    return `
      <rect x="15" y="${y - 12}" width="370" height="26" fill="rgba(255,255,255,0.08)" rx="4"/>
      <text x="25" y="${y - 2}" font-family="Arial, sans-serif" font-size="14" fill="${rankColor}">${medal} ${index + 1}.</text>
      <text x="65" y="${y - 2}" font-family="Arial, sans-serif" font-size="13" fill="white">${entry.display_name}</text>
      <text x="200" y="${y - 2}" font-family="Arial, sans-serif" font-size="11" fill="rgba(255,255,255,0.7)">${entry.puzzles_solved} puzzles</text>
      <text x="360" y="${y - 2}" text-anchor="end" font-family="Arial, sans-serif" font-size="13" font-weight="bold" fill="#4ecdc4">${entry.total_score.toLocaleString()}</text>
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
      <text x="200" y="35" text-anchor="middle" font-family="Arial, sans-serif" font-size="22" font-weight="bold" fill="white">🏆 ScraBBly Leaderboard</text>
      
      <!-- Header -->
      <text x="200" y="55" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="rgba(255,255,255,0.8)">Top 10 Players</text>
      
      <!-- Entries -->
      ${entriesSvg}
      
      <!-- Footer -->
      <text x="200" y="400" text-anchor="middle" font-family="Arial, sans-serif" font-size="11" fill="rgba(255,255,255,0.7)">Play to climb the ranks!</text>
    </svg>
  `;
}
