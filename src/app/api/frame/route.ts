// Farcaster Frame API endpoint
import { NextRequest, NextResponse } from 'next/server';
import { ScraBBlyGame } from '@/lib/game';
import { DatabaseService } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  // Handle GET requests for testing the frame
  try {
    const game = ScraBBlyGame.getInstance();
    const db = DatabaseService.getInstance();
    
    // Generate a sample puzzle for testing
    const puzzle = game.generatePuzzle('medium');
    await db.savePuzzle(puzzle);

    const frameHtml = generateGameFrame(puzzle, [], 0, 0, false);
    
    return new NextResponse(frameHtml, {
      headers: {
        'Content-Type': 'text/html',
      },
    });
  } catch (error) {
    console.error('Frame GET error:', error);
    return new NextResponse('Error generating frame', { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { untrustedData, trustedData } = body;
    
    if (!untrustedData) {
      return new NextResponse('Invalid frame data', { status: 400 });
    }

    const { fid, buttonIndex, inputText, castHash } = untrustedData;
    const game = ScraBBlyGame.getInstance();
    const db = DatabaseService.getInstance();

    // Get or create user
    let user = await db.getUserByFid(fid);
    if (!user) {
      // Create user with default values (in real app, you'd get this from Farcaster)
      user = await db.createUser(fid, `user_${fid}`, `User ${fid}`);
    }

    if (!user) {
      return new NextResponse('Failed to create user', { status: 500 });
    }

    // Handle different button actions
    switch (buttonIndex) {
      case 1: // New Game
        return handleNewGame(game, db);
      
      case 2: // Submit Word
        return handleSubmitWord(game, db, user.id, inputText, castHash, request);
      
      case 3: // Leaderboard
        return handleLeaderboard(db);
      
      case 4: // Next Puzzle
        return handleNewGame(game, db);
      
      default:
        return handleNewGame(game, db);
    }
  } catch (error) {
    console.error('Frame API error:', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}

async function handleNewGame(game: ScraBBlyGame, db: DatabaseService) {
  const puzzle = game.generatePuzzle('medium'); // Always generates 7 letters
  await db.savePuzzle(puzzle);

  const frameHtml = generateGameFrame(puzzle, [], 0, 0, false);
  
  return new NextResponse(frameHtml, {
    headers: {
      'Content-Type': 'text/html',
    },
  });
}

async function handleSubmitWord(
  game: ScraBBlyGame, 
  db: DatabaseService, 
  userId: string, 
  inputText: string,
  castHash: string,
  request: NextRequest
) {
  // In a real implementation, you'd retrieve the current game state
  // For now, we'll create a new puzzle and validate the word
  const puzzle = game.generatePuzzle('medium');
  await db.savePuzzle(puzzle);

  let foundWords: string[] = [];
  let currentScore = 0;
  let totalScore = 0;
  let message = '';

  // Get existing total score from query params or start at 0
  const { searchParams } = new URL(request.url);
  const existingScore = parseInt(searchParams.get('totalScore') || '0');
  totalScore = existingScore;

  if (inputText && inputText.trim()) {
    const validation = await game.validateWord(inputText.trim(), puzzle);
    
    if (validation.isValid) {
      foundWords = [inputText.trim().toUpperCase()];
      const wordScore = game.calculateWordScore(inputText.trim().toUpperCase(), puzzle);
      currentScore = wordScore.points;
      totalScore = existingScore + currentScore;
      
      // Check if player found the target word (advances to next puzzle)
      if (validation.isTargetWord) {
        message = `🎉 Excellent! You found "${inputText.trim().toUpperCase()}"! +${currentScore} pts (Total: ${totalScore})`;
      } else {
        message = `Great! "${inputText.trim().toUpperCase()}" earned ${currentScore} points! (Total: ${totalScore})`;
      }
    } else {
      message = `Invalid word: ${validation.reason}`;
    }
  }

  const frameHtml = generateGameFrame(puzzle, foundWords, currentScore, totalScore, true, message);
  
  return new NextResponse(frameHtml, {
    headers: {
      'Content-Type': 'text/html',
    },
  });
}

async function handleLeaderboard(db: DatabaseService) {
  const leaderboard = await db.getLeaderboard(10);
  
  const frameHtml = generateLeaderboardFrame(leaderboard);
  
  return new NextResponse(frameHtml, {
    headers: {
      'Content-Type': 'text/html',
    },
  });
}

function generateGameFrame(
  puzzle: any, 
  foundWords: string[], 
  currentScore: number,
  totalScore: number,
  showSuccess: boolean = false,
  message: string = ''
) {
  const lettersHtml = puzzle.letters.map((letter: string) => 
    `<div class="letter">${letter}</div>`
  ).join('');

  const foundWordsHtml = foundWords.length > 0 
    ? `<div class="found-words">Found: ${foundWords.join(', ')}</div>`
    : '';

  const successMessage = showSuccess 
    ? '<div class="message success">🎉 Puzzle Complete! Moving to next level!</div>'
    : '';

  // Don't show target word hint - keep it a mystery!

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta property="fc:frame" content="vNext" />
                <meta property="fc:frame:image" content="${process.env.NEXT_PUBLIC_APP_URL}/api/game-image?letters=${puzzle.letters.join('')}&score=${currentScore}&totalScore=${totalScore}&found=${foundWords.join(',')}" />
        <meta property="fc:frame:button:1" content="New Game" />
        <meta property="fc:frame:button:2" content="Submit Word" />
        <meta property="fc:frame:button:3" content="Leaderboard" />
        <meta property="fc:frame:button:4" content="Next Puzzle" />
        <meta property="fc:frame:input:text" content="Enter your word..." />
        <meta property="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_APP_URL}/api/frame?totalScore=${totalScore}" />
        <title>ScraBBly</title>
        <style>
          * { box-sizing: border-box; }
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
            margin: 0; 
            padding: 8px; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-align: center;
            min-height: 100vh;
          }
          .game-container {
            max-width: 100%;
            margin: 0 auto;
            background: rgba(255,255,255,0.95);
            border-radius: 20px;
            padding: 20px;
            backdrop-filter: blur(20px);
            box-shadow: 0 8px 32px rgba(0,0,0,0.1);
            color: #333;
          }
          @media (min-width: 768px) {
            body { padding: 16px; }
            .game-container { 
              max-width: 450px; 
              border-radius: 24px; 
              padding: 24px; 
            }
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 16px;
          }
          h1 {
            font-size: 28px;
            margin: 0;
            background: linear-gradient(135deg, #667eea, #764ba2);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            font-weight: 800;
          }
          .total-score {
            background: linear-gradient(135deg, #4ecdc4, #44a08d);
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 16px;
            font-weight: 700;
            box-shadow: 0 4px 12px rgba(78, 205, 196, 0.3);
          }
          .letters-container {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 12px;
            margin: 20px 0;
            padding: 20px;
            background: linear-gradient(135deg, #f8f9fa, #e9ecef);
            border-radius: 16px;
          }
          .letter {
            width: 50px;
            height: 50px;
            background: linear-gradient(135deg, #667eea, #764ba2);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 22px;
            font-weight: 700;
            color: white;
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
            transition: all 0.3s ease;
          }
          .letter:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
          }
          .success {
            background: linear-gradient(135deg, #28a745, #20c997);
            color: white;
            padding: 12px;
            border-radius: 12px;
            margin: 12px 0;
            font-size: 14px;
            font-weight: 600;
          }
          
          .hint {
            background: linear-gradient(135deg, #ffc107, #fd7e14);
            color: white;
            padding: 12px;
            border-radius: 12px;
            margin: 12px 0;
            font-size: 14px;
            font-weight: 600;
          }
          @media (min-width: 768px) {
            .letters-container { 
              gap: 16px; 
              margin: 24px 0; 
              padding: 24px;
            }
            .letter { 
              width: 60px; 
              height: 60px; 
              font-size: 26px; 
            }
            .success, .hint {
              font-size: 16px;
              padding: 16px;
            }
          }
          .score {
            font-size: 20px;
            font-weight: 700;
            margin: 16px 0;
            color: #667eea;
          }
          .found-words {
            margin: 12px 0;
            font-size: 14px;
            background: linear-gradient(135deg, #e8f5e8, #d4edda);
            color: #155724;
            padding: 12px;
            border-radius: 12px;
            font-weight: 500;
          }
          .message {
            margin: 12px 0;
            padding: 12px;
            background: linear-gradient(135deg, #fff3cd, #ffeaa7);
            border-radius: 12px;
            font-size: 14px;
            color: #856404;
            font-weight: 500;
          }
          .instructions {
            font-size: 13px;
            color: #666;
            margin: 8px 0;
            line-height: 1.4;
          }
        </style>
      </head>
      <body>
        <div class="game-container">
          <div class="header">
            <h1>🎯 ScraBBly</h1>
            <div class="total-score">Total: ${totalScore}</div>
          </div>
          <div class="letters-container">
            ${lettersHtml}
          </div>
          <div class="score">Current: ${currentScore}</div>
          ${foundWordsHtml}
          ${successMessage}
          ${message ? `<div class="message">${message}</div>` : ''}
          <div class="instructions">
            Make words from these scrambled letters.<br>
            Find the main word to advance to the next puzzle!<br>
            <strong>Bonus points for smaller words!</strong>
          </div>
        </div>
      </body>
    </html>
  `;
}

function generateLeaderboardFrame(leaderboard: any[]) {
  const leaderboardHtml = leaderboard.map((entry, index) => 
    `<div class="leaderboard-entry">
      <span class="rank">${index + 1}.</span>
      <span class="username">${entry.display_name}</span>
      <span class="score">${entry.total_score} pts</span>
    </div>`
  ).join('');

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="${process.env.NEXT_PUBLIC_APP_URL}/api/leaderboard-image" />
        <meta property="fc:frame:button:1" content="New Game" />
        <meta property="fc:frame:button:2" content="Back to Game" />
        <meta property="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_APP_URL}/api/frame" />
        <title>ScraBBly Leaderboard</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            margin: 0; 
            padding: 20px; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-align: center;
          }
          .leaderboard-container {
            max-width: 400px;
            margin: 0 auto;
            background: rgba(255,255,255,0.1);
            border-radius: 20px;
            padding: 20px;
            backdrop-filter: blur(10px);
          }
          .leaderboard-entry {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px;
            margin: 5px 0;
            background: rgba(255,255,255,0.1);
            border-radius: 10px;
          }
          .rank {
            font-weight: bold;
            font-size: 18px;
          }
          .username {
            flex: 1;
            text-align: left;
            margin-left: 10px;
          }
          .score {
            font-weight: bold;
            color: #4ecdc4;
          }
        </style>
      </head>
      <body>
        <div class="leaderboard-container">
          <h1>🏆 ScraBBly Leaderboard</h1>
          ${leaderboardHtml}
        </div>
      </body>
    </html>
  `;
}
