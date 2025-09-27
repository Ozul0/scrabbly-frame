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

    const frameHtml = generateGameFrame(puzzle, [], 0, false);
    
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
        return handleSubmitWord(game, db, user.id, inputText, castHash);
      
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

  const frameHtml = generateGameFrame(puzzle, [], 0, false);
  
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
  castHash: string
) {
  // In a real implementation, you'd retrieve the current game state
  // For now, we'll create a new puzzle and validate the word
  const puzzle = game.generatePuzzle('medium');
  await db.savePuzzle(puzzle);

  let foundWords: string[] = [];
  let score = 0;
  let message = '';

  if (inputText && inputText.trim()) {
    const validation = await game.validateWord(inputText.trim(), puzzle);
    
    if (validation.isValid) {
      foundWords = [inputText.trim().toUpperCase()];
      const wordScore = game.calculateWordScore(inputText.trim().toUpperCase(), puzzle);
      score = wordScore.points;
      
      // Check if player found the target word (advances to next puzzle)
      if (validation.isTargetWord) {
        message = `🎉 Excellent! You found "${inputText.trim().toUpperCase()}"! Moving to next puzzle!`;
      } else {
        message = `Great! "${inputText.trim().toUpperCase()}" earned ${score} points!`;
      }
    } else {
      message = `Invalid word: ${validation.reason}`;
    }
  }

  const frameHtml = generateGameFrame(puzzle, foundWords, score, true, message);
  
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
  score: number, 
  showInput: boolean = false,
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

  const targetHint = `<div class="message hint">🎯 Find the 7-letter word: ${puzzle.targetWord}</div>`;

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="${process.env.NEXT_PUBLIC_APP_URL}/api/game-image?letters=${puzzle.letters.join('')}&score=${score}&found=${foundWords.join(',')}" />
        <meta property="fc:frame:button:1" content="New Game" />
        <meta property="fc:frame:button:2" content="Submit Word" />
        <meta property="fc:frame:button:3" content="Leaderboard" />
        <meta property="fc:frame:button:4" content="Next Puzzle" />
        <meta property="fc:frame:input:text" content="Enter your word..." />
        <meta property="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_APP_URL}/api/frame" />
        <title>ScraBBly</title>
        <style>
          * { box-sizing: border-box; }
          body { 
            font-family: Arial, sans-serif; 
            margin: 0; 
            padding: 10px; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-align: center;
            min-height: 100vh;
          }
          .game-container {
            max-width: 100%;
            margin: 0 auto;
            background: rgba(255,255,255,0.1);
            border-radius: 15px;
            padding: 15px;
            backdrop-filter: blur(10px);
          }
          @media (min-width: 768px) {
            body { padding: 20px; }
            .game-container { 
              max-width: 400px; 
              border-radius: 20px; 
              padding: 20px; 
            }
          }
          .letters-container {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 8px;
            margin: 15px 0;
          }
          .letter {
            width: 45px;
            height: 45px;
            background: #ff6b6b;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            font-weight: bold;
            color: white;
            box-shadow: 0 3px 6px rgba(0,0,0,0.2);
          }
          .success {
            background: #d4edda;
            color: #155724;
          }
          
          .hint {
            background: #fff3cd;
            color: #856404;
          }
          @media (min-width: 768px) {
            .letters-container { 
              gap: 10px; 
              margin: 20px 0; 
            }
            .letter { 
              width: 50px; 
              height: 50px; 
              font-size: 24px; 
            }
            .success {
              font-size: 16px;
            }
            
            .hint {
              font-size: 16px;
            }
          }
          .score {
            font-size: 24px;
            font-weight: bold;
            margin: 20px 0;
          }
          .found-words {
            margin: 10px 0;
            font-size: 16px;
          }
          .message {
            margin: 10px 0;
            padding: 10px;
            background: rgba(255,255,255,0.2);
            border-radius: 10px;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="game-container">
          <h1>🎯 ScraBBly</h1>
          <div class="letters-container">
            ${lettersHtml}
          </div>
          <div class="score">Score: ${score}</div>
          ${targetHint}
          ${foundWordsHtml}
          ${successMessage}
          ${message ? `<div class="message">${message}</div>` : ''}
          <p>Make words from these scrambled letters. Find the 7-letter word to advance!</p>
          <p style="font-size: 12px; opacity: 0.8;">Bonus points for longer words!</p>
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
