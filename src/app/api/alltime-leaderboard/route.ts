// API endpoint for all-time leaderboard (top 1000 players)
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '100');
    
    // Mock all-time leaderboard data - replace with real database query
    const allTimeLeaderboard = generateAllTimeLeaderboard(page, limit);
    
    return NextResponse.json({
      success: true,
      leaderboard: allTimeLeaderboard,
      page,
      limit,
      totalPlayers: 1000,
      hasMore: page * limit < 1000
    });
  } catch (error) {
    console.error('All-time leaderboard error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch leaderboard' }, { status: 500 });
  }
}

function generateAllTimeLeaderboard(page: number, limit: number) {
  const startIndex = (page - 1) * limit;
  const endIndex = Math.min(startIndex + limit, 1000);
  
  // Generate 1000 players for all-time leaderboard
  const players = [];
  const names = [
    'WordMaster', 'ScrabbleKing', 'Lexicon', 'WordSmith', 'PuzzlePro', 'LetterLover', 'BrainTeaser',
    'WordWizard', 'ScrambleStar', 'VocabVault', 'PuzzleMaster', 'WordGenius', 'LetterExpert',
    'ScrabbleChamp', 'WordHero', 'PuzzleSolver', 'LetterMaster', 'WordCraft', 'ScramblePro',
    'VocabKing', 'PuzzleKing', 'WordLegend', 'LetterLegend', 'ScrabbleLegend', 'WordChampion',
    'PuzzleChamp', 'LetterChamp', 'WordExpert', 'ScrambleExpert', 'VocabExpert', 'PuzzleExpert',
    'WordStar', 'LetterStar', 'ScrabbleStar', 'VocabStar', 'PuzzleStar', 'WordAce', 'LetterAce',
    'ScrabbleAce', 'VocabAce', 'PuzzleAce', 'WordPro', 'LetterPro', 'ScrabblePro', 'VocabPro'
  ];

  for (let i = startIndex; i < endIndex; i++) {
    // All-time scores are much higher, with top players having 50k+ points
    const totalScore = Math.max(50000 - (i * 50) + Math.floor(Math.random() * 1000), 1000);
    const puzzlesSolved = Math.floor(totalScore / 60) + Math.floor(Math.random() * 20);
    const joinDate = new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000);
    
    players.push({
      rank: i + 1,
      display_name: names[i % names.length] + (i > names.length ? Math.floor(i / names.length) : ''),
      total_score: totalScore,
      puzzles_solved: puzzlesSolved,
      join_date: joinDate.toISOString().split('T')[0],
      is_current_user: false
    });
  }

  return players;
}
