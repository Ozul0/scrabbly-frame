// Core game logic for ScraBBly
export interface Puzzle {
  id: string;
  letters: string[];
  targetWord: string;
  createdAt: Date;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface GameState {
  puzzle: Puzzle;
  foundWords: string[];
  score: number;
  userId?: string;
  sessionId: string;
}

export interface WordScore {
  word: string;
  points: number;
  isBonus: boolean;
}

export class ScraBBlyGame {
  private static instance: ScraBBlyGame;
  private dictionaryService = DictionaryService.getInstance();

  static getInstance(): ScraBBlyGame {
    if (!ScraBBlyGame.instance) {
      ScraBBlyGame.instance = new ScraBBlyGame();
    }
    return ScraBBlyGame.instance;
  }

  generatePuzzle(difficulty: 'easy' | 'medium' | 'hard' = 'medium'): Puzzle {
    // Pre-defined 7-letter words for better gameplay
    const wordSets = {
      easy: [
        'PICTURE', 'STUDENT', 'TEACHER', 'WINTERS', 'SUMMERS', 'FLOWERS', 'GARDENS',
        'FRIENDS', 'HAPPILY', 'QUICKLY', 'BEAUTIF', 'HEALTHY', 'WEATHER', 'MORNING'
      ],
      medium: [
        'PUZZLES', 'SCRABBL', 'MYSTERY', 'FANTASY', 'ADVENTUR', 'CREATIV', 'EXPLORE',
        'JOURNEY', 'LIBRARY', 'SCIENCE', 'HISTORY', 'COUNTRY', 'FACTORY', 'VICTORY'
      ],
      hard: [
        'JUXTAPOS', 'QUIZZING', 'JAZZLIKE', 'QUICKLY', 'XYLOPHON', 'WIZARDRY', 'ZEPHYRS',
        'QUIXOTIC', 'JACKPOTS', 'QUACKERY', 'QUIZZERS', 'JACKPOT', 'QUIZZES', 'JAZZIER'
      ]
    };

    const availableWords = wordSets[difficulty];
    const targetWord = availableWords[Math.floor(Math.random() * availableWords.length)];
    
    // Shuffle the letters of the target word
    const shuffledLetters = targetWord.split('').sort(() => Math.random() - 0.5);
    
    return {
      id: this.generatePuzzleId(),
      letters: shuffledLetters,
      targetWord: targetWord,
      createdAt: new Date(),
      difficulty
    };
  }

  async validateWord(word: string, puzzle: Puzzle): Promise<{ isValid: boolean; reason?: string; isTargetWord?: boolean }> {
    const normalizedWord = word.toUpperCase().trim();
    
    // Check if word is the target word (7-letter word) - this advances the player
    if (normalizedWord === puzzle.targetWord) {
      return { isValid: true, isTargetWord: true };
    }
    
    // Check if word is too short
    if (normalizedWord.length < 3) {
      return { isValid: false, reason: 'Word must be at least 3 letters long' };
    }

    // Check if word can be formed from available letters
    const availableLetters = [...puzzle.letters];
    for (const letter of normalizedWord) {
      const index = availableLetters.indexOf(letter);
      if (index === -1) {
        return { isValid: false, reason: `Letter '${letter}' is not available in this puzzle` };
      }
      availableLetters.splice(index, 1); // Remove used letter
    }

    // Check if word is valid in dictionary
    const isInDictionary = await this.dictionaryService.isValidWord(normalizedWord);
    if (!isInDictionary) {
      return { isValid: false, reason: `${normalizedWord} is not a recognized English word` };
    }

    return { isValid: true, isTargetWord: false };
  }

  calculateWordScore(word: string, puzzle: Puzzle): WordScore {
    const wordLength = word.length;
    let points = wordLength; // Base points = word length
    
    // Bonus for finding the target 7-letter word (advances player)
    if (word === puzzle.targetWord) {
      points += 50; // Huge bonus for completing the puzzle
    } else if (wordLength >= 6) {
      points += 5; // Bonus for longer words
    } else if (wordLength >= 5) {
      points += 2; // Small bonus for 5-letter words
    }

    return {
      word,
      points,
      isBonus: word === puzzle.targetWord || wordLength >= 5
    };
  }

  canFormWord(word: string, puzzle: Puzzle): boolean {
    const normalizedWord = word.toUpperCase().trim();
    const puzzleLetters = [...puzzle.letters];
    
    for (const letter of normalizedWord) {
      const index = puzzleLetters.indexOf(letter);
      if (index === -1) {
        return false;
      }
      puzzleLetters.splice(index, 1); // Remove used letter
    }
    
    return true;
  }

  private generatePuzzleId(): string {
    return `puzzle_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Get all possible words from a puzzle (for hints or validation)
  async getAllPossibleWords(puzzle: Puzzle): Promise<string[]> {
    const possibleWords: string[] = [];
    
    // Add the target word first
    possibleWords.push(puzzle.targetWord);
    
    // Common words that can be made from the letters
    const commonWords = [
      'CAT', 'DOG', 'HOUSE', 'CAR', 'TREE', 'BOOK', 'WATER', 'FIRE', 'EARTH',
      'AIR', 'LOVE', 'HOPE', 'DREAM', 'LIGHT', 'DARK', 'GOOD', 'BAD', 'BIG',
      'SMALL', 'FAST', 'SLOW', 'HOT', 'COLD', 'NEW', 'OLD', 'YOUNG', 'HAPPY',
      'SAD', 'ANGRY', 'CALM', 'PEACE', 'WAR', 'LIFE', 'DEATH', 'TIME', 'SPACE'
    ];
    
    for (const word of commonWords) {
      if (this.canFormWord(word, puzzle)) {
        const validation = await this.validateWord(word, puzzle);
        if (validation.isValid && !possibleWords.includes(word)) {
          possibleWords.push(word);
        }
      }
    }
    
    return possibleWords;
  }
}

// Import DictionaryService
import { DictionaryService } from './dictionary';
