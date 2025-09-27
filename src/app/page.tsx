// Main page for Word Cookies Frame
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto bg-white/10 backdrop-blur-lg rounded-xl p-6 text-center text-white sm:rounded-2xl sm:p-8">
        <h1 className="text-4xl font-bold mb-4">🎯 ScraBBly</h1>
        <p className="text-lg mb-6">
          7-letter word scramble game for Farcaster Frames!
        </p>
        
        <div className="space-y-4">
          <div className="bg-white/20 rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-2">How to Play</h2>
            <ul className="text-sm text-left space-y-1">
              <li>• Make words from 7 scrambled letters</li>
              <li>• Find the 7-letter word to advance</li>
              <li>• Try to find longer words for bonus points</li>
              <li>• Complete puzzles to unlock new levels!</li>
            </ul>
          </div>
          
          <div className="bg-white/20 rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-2">Frame URL</h2>
            <p className="text-sm break-all">
              {process.env.NEXT_PUBLIC_APP_URL}/api/frame
            </p>
          </div>
          
          <div className="space-y-2">
            <Link 
              href="/api/frame"
              className="block w-full bg-white/30 hover:bg-white/40 rounded-lg py-3 px-4 transition-colors"
            >
              Test Frame
            </Link>
            <Link 
              href="/api/leaderboard-image"
              className="block w-full bg-white/30 hover:bg-white/40 rounded-lg py-3 px-4 transition-colors"
            >
              View Leaderboard Image
            </Link>
          </div>
        </div>
        
        <div className="mt-8 text-sm text-white/70">
          <p>Built with Next.js & Supabase</p>
          <p>Deploy to Vercel for production use</p>
        </div>
      </div>
    </div>
  );
}
