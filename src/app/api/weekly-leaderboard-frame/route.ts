// API endpoint for weekly leaderboard frame
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const frameHtml = generateWeeklyLeaderboardFrame();
    
    return new NextResponse(frameHtml, {
      headers: {
        'Content-Type': 'text/html',
      },
    });
  } catch (error) {
    console.error('Weekly leaderboard frame error:', error);
    return new NextResponse('Error generating frame', { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const frameHtml = generateWeeklyLeaderboardFrame();
    
    return new NextResponse(frameHtml, {
      headers: {
        'Content-Type': 'text/html',
      },
    });
  } catch (error) {
    console.error('Weekly leaderboard frame error:', error);
    return new NextResponse('Error generating frame', { status: 500 });
  }
}

function generateWeeklyLeaderboardFrame() {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="${process.env.NEXT_PUBLIC_APP_URL}/api/leaderboard-image?type=weekly" />
        <meta property="fc:frame:button:1" content="🏠 Back to Game" />
        <meta property="fc:frame:button:2" content="📊 All-Time" />
        <meta property="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_APP_URL}/api/frame" />
        <title>Weekly Leaderboard - ScraBBly</title>
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
          .leaderboard-container {
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
            .leaderboard-container { 
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
          .week-badge {
            background: linear-gradient(135deg, #4ecdc4, #44a08d);
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 700;
            box-shadow: 0 4px 12px rgba(78, 205, 196, 0.3);
          }
          .description {
            background: linear-gradient(135deg, #e8f5e8, #d4edda);
            color: #155724;
            padding: 12px;
            border-radius: 12px;
            margin: 16px 0;
            font-size: 14px;
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
        <div class="leaderboard-container">
          <div class="header">
            <h1>🏆 Weekly</h1>
            <div class="week-badge">Week 40</div>
          </div>
          <div class="description">
            🎯 This week's top performers! Rankings reset every Monday.<br>
            🏅 Top 50 players compete for weekly glory!
          </div>
          <div class="instructions">
            Click "All-Time" to see lifetime rankings, or "Back to Game" to continue playing!
          </div>
        </div>
      </body>
    </html>
  `;
}
