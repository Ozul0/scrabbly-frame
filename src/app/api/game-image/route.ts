// API endpoint to generate game images for Farcaster Frame
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const letters = searchParams.get('letters') || '';
    const score = parseInt(searchParams.get('score') || '0');
    const found = searchParams.get('found') || '';
    
    // Generate SVG image
    const svg = generateGameImage(letters, score, found);
    
    return new NextResponse(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Image generation error:', error);
    return new NextResponse('Error generating image', { status: 500 });
  }
}

function generateGameImage(letters: string, score: number, found: string) {
  const letterArray = letters.split('');
  const foundWords = found ? found.split(',') : [];
  
  // Calculate positions for circular layout
  const centerX = 200;
  const centerY = 200;
  const radius = 80;
  const letterPositions = letterArray.map((_, index) => {
    const angle = (index * 2 * Math.PI) / letterArray.length;
    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
      letter: letterArray[index]
    };
  });

  const lettersSvg = letterPositions.map((pos, index) => {
    const isCenter = index === 0;
    const size = isCenter ? 50 : 40;
    const fill = isCenter ? '#4ecdc4' : '#ff6b6b';
    
    return `
      <circle cx="${pos.x}" cy="${pos.y}" r="${size/2 + 5}" fill="${fill}" stroke="white" stroke-width="2"/>
      <text x="${pos.x}" y="${pos.y + 5}" text-anchor="middle" font-family="Arial, sans-serif" font-size="${isCenter ? '20' : '16'}" font-weight="bold" fill="white">${pos.letter}</text>
    `;
  }).join('');

  const foundWordsText = foundWords.length > 0 
    ? `<text x="200" y="320" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" fill="white">Found: ${foundWords.join(', ')}</text>`
    : '';

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
      <text x="200" y="40" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="white">🎯 ScraBBly</text>
      
      <!-- Letters in circle -->
      ${lettersSvg}
      
      <!-- Score -->
      <text x="200" y="280" text-anchor="middle" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="white">Score: ${score}</text>
      
      <!-- Found words -->
      ${foundWordsText}
      
      <!-- Instructions -->
      <text x="200" y="360" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="white">Use all letters to form words!</text>
    </svg>
  `;
}
