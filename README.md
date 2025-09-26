# 🎯 ScraBBly Frame

A fun word puzzle game built for Farcaster Frames! Players form words from a set of letters, similar to the classic word puzzle games.

## Features

- **Interactive Gameplay**: Form words using provided letters
- **Scoring System**: Points based on word length and bonuses
- **Leaderboard**: Track top players across sessions
- **Farcaster Integration**: Native Frame support with buttons and input
- **Real-time Validation**: Dictionary API integration for word validation
- **Responsive Design**: Beautiful circular letter layout

## Tech Stack

- **Frontend**: Next.js 14 with TypeScript
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Dictionary**: Free Dictionary API
- **Deployment**: Vercel
- **Frame Protocol**: Farcaster Frames vNext

## Quick Start

### 1. Clone and Install

```bash
git clone <your-repo>
cd scrabbly-frame
npm install
```

### 2. Set up Supabase

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Run the SQL schema from `supabase-schema.sql` in your Supabase SQL editor
3. Get your project URL and API keys

### 3. Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to test the frame.

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

The frame URL will be: `https://your-app.vercel.app/api/frame`

### Deploy to Other Platforms

The app can also be deployed to:
- **Netlify**: Use `npm run build` and deploy the `.next` folder
- **Railway**: Connect your GitHub repo and deploy
- **Any Node.js hosting**: Build and start the production server

## Frame Integration

### Frame URL
```
https://your-app.vercel.app/api/frame
```

### Frame Features
- **Button 1**: New Game
- **Button 2**: Submit Word
- **Button 3**: Leaderboard
- **Button 4**: Next Puzzle
- **Text Input**: Enter your word guess

### Frame Protocol Compliance
- Uses Farcaster Frames vNext specification
- Proper meta tags for frame rendering
- Button and input handling
- Post URL for interactions

## Game Rules

1. **Letter Usage**: Use only the provided letters to form words
2. **Center Letter**: Every word must contain the center letter
3. **Minimum Length**: Words must be at least 3 letters long
4. **Scoring**: 
   - Base points = word length
   - Bonus points for 5+ letter words
   - Extra bonus for 7+ letter words
   - Pangram bonus for using all letters

## API Endpoints

- `GET /api/frame` - Main frame endpoint
- `GET /api/game-image` - Generate game images
- `GET /api/leaderboard-image` - Generate leaderboard images

## Database Schema

The app uses Supabase with the following main tables:
- `users` - User profiles and Farcaster IDs
- `puzzles` - Generated puzzles and statistics
- `game_sessions` - Individual game sessions and scores
- Views for leaderboard and user statistics

## Customization

### Adding New Difficulty Levels
Edit `src/lib/game.ts` to modify the `letterSets` object.

### Changing Scoring Rules
Modify the `calculateWordScore` function in `src/lib/game.ts`.

### Styling the Frame
Update the CSS in the frame generation functions in `src/app/api/frame/route.ts`.

## Troubleshooting

### Common Issues

1. **Dictionary API Errors**: The app includes a fallback word list for basic validation
2. **Frame Not Loading**: Check that your environment variables are set correctly
3. **Database Connection**: Ensure Supabase credentials are correct and the schema is deployed

### Debug Mode

Set `NODE_ENV=development` to see detailed error logs.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this project for your own Farcaster Frames!

## Support

For issues and questions:
- Check the troubleshooting section
- Review Farcaster Frame documentation
- Open an issue on GitHub

---

Built with ❤️ for the Farcaster community!
