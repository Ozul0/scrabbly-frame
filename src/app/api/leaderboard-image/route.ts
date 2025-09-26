// API endpoint to generate leaderboard images for Farcaster Frame
import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const db = DatabaseService.getInstance();
    const leaderboard = await db.getLeaderboard(10);
    
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
  const entries = leaderboard.slice(0, 8); // Show top 8 for space
  
  const entriesSvg = entries.map((entry, index) => {
    const y = 80 + (index * 35);
    const medal = index < 3 ? ['🥇', '🥈', '🥉'][index] : '';
    
    return `
      <rect x="20" y="${y - 15}" width="360" height="30" fill="rgba(255,255,255,0.1)" rx="5"/>
      <text x="30" y="${y}" font-family="Arial, sans-serif" font-size="16" fill="white">${medal} ${index + 1}.</text>
      <text x="80" y="${y}" font-family="Arial, sans-serif" font-size="14" fill="white">${entry.display_name}</text>
      <text x="350" y="${y}" text-anchor="end" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#4ecdc4">${entry.total_score} pts</text>
    `;
  }).join('');

  return `
    <svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
        </linearGradient>
      </defs>
      
      <rect width="400" height="400" fill="url(#bg)"/>
      
      <!-- Title -->
      <text x="200" y="40" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="white">🏆 ScraBBly Leaderboard</text>
      
      <!-- Entries -->
      ${entriesSvg}
      
      <!-- Footer -->
      <text x="200" y="380" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="white">Play to climb the ranks!</text>
    </svg>
  `;
}
