-- Supabase database schema for Word Cookies Frame

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  fid INTEGER UNIQUE NOT NULL, -- Farcaster ID
  username VARCHAR(50) NOT NULL,
  display_name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Puzzles table
CREATE TABLE puzzles (
  id VARCHAR(50) PRIMARY KEY,
  letters TEXT[] NOT NULL,
  center_letter VARCHAR(1) NOT NULL,
  difficulty VARCHAR(10) NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  total_plays INTEGER DEFAULT 0,
  average_score DECIMAL(10,2) DEFAULT 0
);

-- Game sessions table
CREATE TABLE game_sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  puzzle_id VARCHAR(50) REFERENCES puzzles(id) ON DELETE CASCADE,
  score INTEGER NOT NULL DEFAULT 0,
  found_words TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for better performance
CREATE INDEX idx_users_fid ON users(fid);
CREATE INDEX idx_game_sessions_user_id ON game_sessions(user_id);
CREATE INDEX idx_game_sessions_puzzle_id ON game_sessions(puzzle_id);
CREATE INDEX idx_game_sessions_score ON game_sessions(score DESC);
CREATE INDEX idx_game_sessions_created_at ON game_sessions(created_at DESC);

-- Leaderboard view
CREATE OR REPLACE VIEW leaderboard_view AS
SELECT 
  u.id as user_id,
  u.username,
  u.display_name,
  COALESCE(SUM(gs.score), 0) as total_score,
  COUNT(gs.id) as games_played,
  COALESCE(MAX(gs.score), 0) as best_score,
  ROW_NUMBER() OVER (ORDER BY COALESCE(SUM(gs.score), 0) DESC) as rank
FROM users u
LEFT JOIN game_sessions gs ON u.id = gs.user_id
GROUP BY u.id, u.username, u.display_name
ORDER BY total_score DESC;

-- User stats view
CREATE OR REPLACE VIEW user_stats_view AS
SELECT 
  u.id as user_id,
  COALESCE(SUM(gs.score), 0) as total_score,
  COUNT(gs.id) as games_played,
  COALESCE(MAX(gs.score), 0) as best_score,
  COALESCE(AVG(gs.score), 0) as average_score
FROM users u
LEFT JOIN game_sessions gs ON u.id = gs.user_id
GROUP BY u.id;

-- Function to update puzzle statistics
CREATE OR REPLACE FUNCTION update_puzzle_stats()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE puzzles 
  SET 
    total_plays = total_plays + 1,
    average_score = (
      SELECT AVG(score) 
      FROM game_sessions 
      WHERE puzzle_id = NEW.puzzle_id
    )
  WHERE id = NEW.puzzle_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update puzzle statistics when a game session is completed
CREATE TRIGGER trigger_update_puzzle_stats
  AFTER INSERT ON game_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_puzzle_stats();

-- Function to update user's updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at for users
CREATE TRIGGER trigger_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data for testing
INSERT INTO puzzles (id, letters, center_letter, difficulty) VALUES
('sample_easy_1', ARRAY['C', 'A', 'T', 'S', 'E'], 'C', 'easy'),
('sample_medium_1', ARRAY['W', 'O', 'R', 'D', 'S', 'E'], 'W', 'medium'),
('sample_hard_1', ARRAY['P', 'U', 'Z', 'Z', 'L', 'E', 'S'], 'P', 'hard');

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;
