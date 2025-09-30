// API endpoint for weekly leaderboard (top 50 players)
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Mock weekly leaderboard data - replace with real database query
    const weeklyLeaderboard = generateWeeklyLeaderboard();
    
    return NextResponse.json({
      success: true,
      leaderboard: weeklyLeaderboard,
      week: getCurrentWeek(),
      totalPlayers: weeklyLeaderboard.length
    });
  } catch (error) {
    console.error('Weekly leaderboard error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch leaderboard' }, { status: 500 });
  }
}

function generateWeeklyLeaderboard() {
  // Generate 50 players for weekly leaderboard
  const players = [];
  const names = [
    'WordMaster', 'ScrabbleKing', 'Lexicon', 'WordSmith', 'PuzzlePro', 'LetterLover', 'BrainTeaser',
    'WordWizard', 'ScrambleStar', 'VocabVault', 'PuzzleMaster', 'WordGenius', 'LetterExpert',
    'ScrabbleChamp', 'WordHero', 'PuzzleSolver', 'LetterMaster', 'WordCraft', 'ScramblePro',
    'VocabKing', 'PuzzleKing', 'WordLegend', 'LetterLegend', 'ScrabbleLegend', 'WordChampion',
    'PuzzleChamp', 'LetterChamp', 'WordExpert', 'ScrambleExpert', 'VocabExpert', 'PuzzleExpert',
    'WordStar', 'LetterStar', 'ScrabbleStar', 'VocabStar', 'PuzzleStar', 'WordAce', 'LetterAce',
    'ScrabbleAce', 'VocabAce', 'PuzzleAce', 'WordPro', 'LetterPro', 'ScrabblePro', 'VocabPro',
    'PuzzlePro', 'WordBoss', 'LetterBoss', 'ScrabbleBoss', 'VocabBoss', 'PuzzleBoss'
  ];

  for (let i = 0; i < 50; i++) {
    const weeklyScore = Math.floor(Math.random() * 2000) + 500; // 500-2500 points this week
    const puzzlesSolved = Math.floor(weeklyScore / 50) + Math.floor(Math.random() * 10); // Roughly based on score
    
    players.push({
      rank: i + 1,
      display_name: names[i] || `Player${i + 1}`,
      weekly_score: weeklyScore,
      puzzles_solved: puzzlesSolved,
      is_current_user: false
    });
  }

  // Sort by weekly score descending
  return players.sort((a, b) => b.weekly_score - a.weekly_score).map((player, index) => ({
    ...player,
    rank: index + 1
  }));
}

function getCurrentWeek() {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const days = Math.floor((now.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24));
  return Math.ceil((days + startOfYear.getDay() + 1) / 7);
}
