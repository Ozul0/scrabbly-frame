// Core game logic for ScraBBly
export interface Puzzle {
  id: string;
  letters: string[];
  centerLetter: string;
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
    const letterSets = {
      easy: ['A', 'E', 'I', 'O', 'U', 'R', 'S', 'T', 'L', 'N', 'D', 'G', 'B', 'C', 'M', 'P', 'F', 'H', 'V', 'W', 'Y'],
      medium: ['A', 'E', 'I', 'O', 'U', 'R', 'S', 'T', 'L', 'N', 'D', 'G', 'B', 'C', 'M', 'P', 'F', 'H', 'V', 'W', 'Y', 'K', 'J', 'X', 'Q', 'Z'],
      hard: ['A', 'E', 'I', 'O', 'U', 'R', 'S', 'T', 'L', 'N', 'D', 'G', 'B', 'C', 'M', 'P', 'F', 'H', 'V', 'W', 'Y', 'K', 'J', 'X', 'Q', 'Z']
    };

    const availableLetters = letterSets[difficulty];
    const letterCount = 7; // Always 7 letters for classic Word Cookies gameplay
    
    // Ensure we have at least one vowel
    const vowels = ['A', 'E', 'I', 'O', 'U'];
    const selectedLetters = [vowels[Math.floor(Math.random() * vowels.length)]];
    
    // Add remaining letters
    while (selectedLetters.length < letterCount) {
      const randomLetter = availableLetters[Math.floor(Math.random() * availableLetters.length)];
      if (!selectedLetters.includes(randomLetter)) {
        selectedLetters.push(randomLetter);
      }
    }

    // Shuffle the letters
    const shuffledLetters = selectedLetters.sort(() => Math.random() - 0.5);
    
    return {
      id: this.generatePuzzleId(),
      letters: shuffledLetters,
      centerLetter: shuffledLetters[0], // First letter is the center
      createdAt: new Date(),
      difficulty
    };
  }

  async validateWord(word: string, puzzle: Puzzle): Promise<{ isValid: boolean; reason?: string }> {
    const normalizedWord = word.toUpperCase().trim();
    
    // Check if word is too short
    if (normalizedWord.length < 3) {
      return { isValid: false, reason: 'Word must be at least 3 letters long' };
    }

    // Check if word contains only letters from the puzzle
    const puzzleLetters = puzzle.letters.join('');
    for (const letter of normalizedWord) {
      if (!puzzleLetters.includes(letter)) {
        return { isValid: false, reason: `Letter '${letter}' is not available in this puzzle` };
      }
    }

    // Check if word uses the center letter (required in Word Cookies)
    if (!normalizedWord.includes(puzzle.centerLetter)) {
      return { isValid: false, reason: `Word must contain the center letter '${puzzle.centerLetter}'` };
    }

    // Check if word is valid in dictionary
    const isInDictionary = await this.dictionaryService.isValidWord(normalizedWord);
    if (!isInDictionary) {
      return { isValid: false, reason: 'Word not found in dictionary' };
    }

    return { isValid: true };
  }

  calculateWordScore(word: string, puzzle: Puzzle): WordScore {
    const wordLength = word.length;
    let points = wordLength; // Base points = word length
    
    // Enhanced scoring for 7-letter word game
    if (wordLength >= 7) {
      points += 10; // Big bonus for 7-letter words
    } else if (wordLength >= 5) {
      points += 3; // Bonus for 5+ letter words
    }

    // Special bonus for using all 7 letters (pangram)
    if (wordLength === 7) {
      const uniqueLetters = new Set(word.split(''));
      const puzzleLetters = new Set(puzzle.letters);
      const isPangram = uniqueLetters.size === puzzleLetters.size && 
                       Array.from(uniqueLetters).every(letter => puzzleLetters.has(letter));
      
      if (isPangram) {
        points += 20; // Huge bonus for 7-letter pangram
      }
    }

    return {
      word,
      points,
      isBonus: wordLength >= 5 || (wordLength === 7 && wordLength === puzzle.letters.length)
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
    // This would typically use a more sophisticated algorithm
    // For now, we'll return a basic implementation
    const possibleWords: string[] = [];
    
    // Generate all possible combinations (this is simplified)
    const letters = puzzle.letters;
    const centerLetter = puzzle.centerLetter;
    
    // This is a placeholder - in a real implementation, you'd use
    // a more efficient algorithm to generate all valid combinations
    const commonWords = [
      'CAT', 'DOG', 'HOUSE', 'CAR', 'TREE', 'BOOK', 'WATER', 'FIRE', 'EARTH',
      'AIR', 'LOVE', 'HOPE', 'DREAM', 'LIGHT', 'DARK', 'GOOD', 'BAD', 'BIG',
      'SMALL', 'FAST', 'SLOW', 'HOT', 'COLD', 'NEW', 'OLD', 'YOUNG', 'HAPPY',
      'SAD', 'ANGRY', 'CALM', 'PEACE', 'WAR', 'LIFE', 'DEATH', 'TIME', 'SPACE'
    ];
    
    for (const word of commonWords) {
      if (this.canFormWord(word, puzzle)) {
        const validation = await this.validateWord(word, puzzle);
        if (validation.isValid) {
          possibleWords.push(word);
        }
      }
    }
    
    return possibleWords;
  }
}

// Import DictionaryService
import { DictionaryService } from './dictionary';
