// Supabase client configuration
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder_key';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder_service_key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// Database types
export interface User {
  id: string;
  fid: number; // Farcaster ID
  username: string;
  display_name: string;
  created_at: string;
  updated_at: string;
}

export interface GameSession {
  id: string;
  user_id: string;
  puzzle_id: string;
  score: number;
  found_words: string[];
  created_at: string;
  completed_at?: string;
}

export interface LeaderboardEntry {
  user_id: string;
  username: string;
  display_name: string;
  total_score: number;
  games_played: number;
  best_score: number;
  rank: number;
}

export interface PuzzleRecord {
  id: string;
  letters: string[];
  target_word: string;
  difficulty: string;
  created_at: string;
  total_plays: number;
  average_score: number;
}

// Database service class
export class DatabaseService {
  private static instance: DatabaseService;

  static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  async createUser(fid: number, username: string, displayName: string): Promise<User | null> {
    try {
      const { data, error } = await supabaseAdmin
        .from('users')
        .insert({
          fid,
          username,
          display_name: displayName,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating user:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error creating user:', error);
      return null;
    }
  }

  async getUserByFid(fid: number): Promise<User | null> {
    try {
      const { data, error } = await supabaseAdmin
        .from('users')
        .select('*')
        .eq('fid', fid)
        .single();

      if (error) {
        console.error('Error fetching user:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error fetching user:', error);
      return null;
    }
  }

  async createGameSession(
    userId: string,
    puzzleId: string,
    score: number,
    foundWords: string[]
  ): Promise<GameSession | null> {
    try {
      const { data, error } = await supabaseAdmin
        .from('game_sessions')
        .insert({
          user_id: userId,
          puzzle_id: puzzleId,
          score,
          found_words: foundWords,
          completed_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating game session:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error creating game session:', error);
      return null;
    }
  }

  async getLeaderboard(limit: number = 10): Promise<LeaderboardEntry[]> {
    try {
      const { data, error } = await supabaseAdmin
        .from('leaderboard_view')
        .select('*')
        .limit(limit);

      if (error) {
        console.error('Error fetching leaderboard:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      return [];
    }
  }

  async getUserStats(userId: string): Promise<{
    totalScore: number;
    gamesPlayed: number;
    bestScore: number;
    averageScore: number;
  } | null> {
    try {
      const { data, error } = await supabaseAdmin
        .from('user_stats_view')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error fetching user stats:', error);
        return null;
      }

      return {
        totalScore: data.total_score || 0,
        gamesPlayed: data.games_played || 0,
        bestScore: data.best_score || 0,
        averageScore: data.average_score || 0,
      };
    } catch (error) {
      console.error('Error fetching user stats:', error);
      return null;
    }
  }

  async savePuzzle(puzzle: {
    id: string;
    letters: string[];
    targetWord: string;
    difficulty: string;
  }): Promise<boolean> {
    try {
      const { error } = await supabaseAdmin
        .from('puzzles')
        .insert({
          id: puzzle.id,
          letters: puzzle.letters,
          target_word: puzzle.targetWord,
          difficulty: puzzle.difficulty,
        });

      if (error) {
        console.error('Error saving puzzle:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error saving puzzle:', error);
      return false;
    }
  }
}
