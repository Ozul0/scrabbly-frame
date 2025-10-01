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
  private usedWords: string[] = [];
  private readonly MAX_WORDS_BEFORE_REPEAT = 300;

  static getInstance(): ScraBBlyGame {
    if (!ScraBBlyGame.instance) {
      ScraBBlyGame.instance = new ScraBBlyGame();
    }
    return ScraBBlyGame.instance;
  }

  generatePuzzle(difficulty: 'easy' | 'medium' | 'hard' = 'medium'): Puzzle {
    // Mixed length words (7-10 letters) for better gameplay
    const wordSets = {
      easy: [
        // 7-10 letters
        'PICTURE', 'STUDENT', 'TEACHER', 'WINTERS', 'SUMMERS', 'FLOWERS', 'GARDENS',
        'FRIENDS', 'HAPPILY', 'QUICKLY', 'BEAUTIFUL', 'HEALTHY', 'WEATHER', 'MORNING',
        'FAMILY', 'VACATION', 'HOLIDAY', 'BIRTHDAY', 'WEEKEND', 'PURPOSE', 'COUNTRY',
        'FUTURE', 'PRESENT', 'PASSION', 'FASHION', 'MISSION', 'VERSION', 'SERVICE',
        'PARKING', 'RUNNING', 'SINGING', 'DANCING', 'SWIMMING', 'COOKING', 'READING',
        'WRITING', 'DRIVING', 'WORKING', 'LEARNING', 'TEACHING', 'HELPING', 'SHARING',
        'CARING', 'LOVING', 'LIVING', 'GIVING', 'TAKING', 'MAKING', 'BREAKING',
        'CREATING', 'DESIGNING', 'BUILDING', 'PLANNING', 'STARTING', 'FINISHING',
        'BEGINNING', 'ENDING', 'CHANGING', 'GROWING', 'IMPROVING', 'DEVELOPING',
        'DISCOVERING', 'EXPLORING', 'ADVENTURE', 'TRAVELING', 'VISITING',
        'COMPUTER', 'PROGRAMMING', 'DEVELOPING', 'CREATING', 'BUILDING', 'DESIGNING',
        'HOSPITAL', 'LIBRARY', 'SCHOOL', 'COLLEGE', 'UNIVERSITY', 'ACADEMY',
        'MOUNTAIN', 'OCEAN', 'FOREST', 'DESERT', 'RIVER', 'LAKE', 'VALLEY',
        'BIRTHDAY', 'WEDDING', 'HOLIDAY', 'VACATION', 'WEEKEND', 'EVENING',
        'AFTERNOON', 'NIGHTTIME', 'DAYTIME', 'SUNRISE', 'SUNSET',
        'SUNSHINE', 'MOONLIGHT', 'STARLIGHT', 'RAINBOW', 'THUNDER', 'LIGHTNING',
        'CREATURE', 'ANIMAL', 'BIRD', 'FISH', 'MAMMAL', 'REPTILE', 'INSECT',
        'WONDERED', 'EXPLORED', 'DISCOVERED', 'CREATED', 'BUILT', 'DESIGNED',
        'HAPPIEST', 'BEST', 'GREATEST', 'FINEST', 'FAVORITE', 'PERFECT',
        // 8 letters  
        'CREATURE', 'MOUNTAIN', 'BIRTHDAY', 'CHILDREN', 'WONDERED', 'HAPPIEST', 'SUNSHINE',
        'COMPUTER', 'BROTHER', 'SISTER', 'HOSPITAL', 'LIBRARY', 'SCHOOL', 'COLLEGE',
        'WONDERFUL', 'BEAUTIFUL', 'AMAZING', 'FANTASTIC', 'TERRIFIC', 'EXCELLENT',
        'MARVELOUS', 'SPLENDID', 'MAGNIFICENT', 'SPECTACULAR', 'OUTSTANDING',
        'KNOWLEDGE', 'EDUCATION', 'LEARNING', 'TEACHING', 'STUDYING', 'RESEARCHING',
        'INVESTIGATING', 'EXAMINING', 'ANALYZING', 'UNDERSTANDING', 'COMPREHENDING',
        'DEVELOPING', 'IMPROVING', 'ENHANCING', 'ADVANCING', 'PROGRESSING', 'ACHIEVING',
        'SUCCEEDING', 'ACCOMPLISHING', 'COMPLETING', 'FINISHING', 'FULFILLING',
        'SATISFYING', 'PLEASING', 'DELIGHTING', 'AMAZING', 'ASTONISHING', 'SURPRISING'
      ],
      medium: [
        // 7 letters
        'MYSTERY', 'FANTASY', 'ADVENTURE', 'EXPLORE', 'JOURNEY', 'SCIENCE', 'HISTORY', 
        'COUNTRY', 'FACTORY', 'VICTORY', 'PUZZLES', 'SCRABBLE', 'MYSTERIES', 'CREATIVE',
        'KNOWLEDGE', 'EDUCATION', 'LEARNING', 'TEACHING', 'STUDYING', 'RESEARCHING',
        'INVESTIGATING', 'EXAMINING', 'ANALYZING', 'UNDERSTANDING', 'COMPREHENDING',
        'DEVELOPING', 'IMPROVING', 'ENHANCING', 'ADVANCING', 'PROGRESSING', 'ACHIEVING',
        'SUCCEEDING', 'ACCOMPLISHING', 'COMPLETING', 'FINISHING', 'FULFILLING',
        'SATISFYING', 'PLEASING', 'DELIGHTING', 'AMAZING', 'ASTONISHING', 'SURPRISING',
        'SHOCKING', 'INCREDIBLE', 'FANTASTIC', 'WONDERFUL', 'MAGNIFICENT', 'SPECTACULAR',
        'EXTRAORDINARY', 'REMARKABLE', 'OUTSTANDING', 'EXCEPTIONAL', 'PHENOMENAL',
        'TECHNOLOGY', 'INNOVATION', 'CREATION', 'INVENTION', 'DISCOVERY', 'BREAKTHROUGH',
        'REVOLUTION', 'TRANSFORMATION', 'EVOLUTION', 'ADVANCEMENT', 'PROGRESS',
        'ACHIEVEMENT', 'ACCOMPLISHMENT', 'SUCCESS', 'VICTORY', 'TRIUMPH', 'CONQUEST',
        'ADVENTURE', 'EXPLORATION', 'EXPEDITION', 'MISSION', 'JOURNEY', 'VOYAGE',
        'TRAVEL', 'EXCURSION', 'PILGRIMAGE', 'WANDERING', 'ROAMING', 'ROVING',
        'INVESTIGATION', 'RESEARCH', 'STUDY', 'ANALYSIS', 'EXAMINATION', 'INSPECTION',
        'OBSERVATION', 'EXPERIMENTATION', 'TESTING', 'TRIAL', 'EXPERIMENT', 'DEMONSTRATION',
        // 8 letters
        'CREATIVE', 'MYSTERIES', 'ADVENTURE', 'EXPLORER', 'JOURNEYS', 'SCIENTIFIC', 'HISTORIC',
        'COUNTRIES', 'FACTORIES', 'VICTORIES', 'PUZZLING', 'SCRABBLE',
        // 9 letters
        'CREATIVITY', 'MYSTERIES', 'ADVENTURES', 'EXPLORERS', 'JOURNEYS', 'SCIENTIFIC',
        'KNOWLEDGE', 'EDUCATION', 'LEARNING', 'TEACHING', 'STUDYING', 'RESEARCHING',
        'INVESTIGATING', 'EXAMINING', 'ANALYZING', 'UNDERSTANDING', 'COMPREHENDING',
        'DEVELOPING', 'IMPROVING', 'ENHANCING', 'ADVANCING', 'PROGRESSING', 'ACHIEVING',
        'SUCCEEDING', 'ACCOMPLISHING', 'COMPLETING', 'FINISHING', 'FULFILLING',
        'SATISFYING', 'PLEASING', 'DELIGHTING', 'AMAZING', 'ASTONISHING', 'SURPRISING',
        'SHOCKING', 'INCREDIBLE', 'FANTASTIC', 'WONDERFUL', 'MAGNIFICENT', 'SPECTACULAR',
        'EXTRAORDINARY', 'REMARKABLE', 'OUTSTANDING', 'EXCEPTIONAL', 'PHENOMENAL',
        'TECHNOLOGY', 'INNOVATION', 'CREATION', 'INVENTION', 'DISCOVERY', 'BREAKTHROUGH',
        'REVOLUTION', 'TRANSFORMATION', 'EVOLUTION', 'ADVANCEMENT', 'PROGRESS',
        'ACHIEVEMENT', 'ACCOMPLISHMENT', 'SUCCESS', 'VICTORY', 'TRIUMPH', 'CONQUEST'
      ],
      hard: [
        // 8 letters
        'JUXTAPOS', 'QUIZZING', 'JAZZLIKE', 'XYLOPHON', 'WIZARDRY', 'ZEPHYRS',
        'QUIXOTIC', 'JACKPOTS', 'QUACKERY', 'QUIZZERS', 'JACKPOT', 'QUIZZES',
        'PHILOSOPHY', 'PSYCHOLOGY', 'SOCIOLOGY', 'ANTHROPOLOGY', 'ARCHAEOLOGY',
        'METEOROLOGY', 'GEOLOGY', 'BIOLOGY', 'CHEMISTRY', 'PHYSICS', 'ASTRONOMY',
        'MATHEMATICS', 'STATISTICS', 'PROBABILITY', 'CALCULUS', 'ALGEBRA', 'GEOMETRY',
        'TRIGONOMETRY', 'TOPOLOGY', 'ANALYSIS', 'SYNTHESIS', 'HYPOTHESIS', 'THESIS',
        'ANTITHESIS', 'PARENTHESIS', 'METATHESIS', 'PROSTHESIS', 'SYNTHESIS',
        'PHOTOGRAPH', 'PHOTOGRAPHER', 'PHOTOGRAPHY', 'PHOTOSYNTHESIS', 'PHOTOCHEMISTRY',
        'PSYCHOLOGICAL', 'PHILOSOPHICAL', 'SOCIOLOGICAL', 'ANTHROPOLOGICAL',
        'ARCHAEOLOGICAL', 'METEOROLOGICAL', 'GEOLOGICAL', 'BIOLOGICAL', 'CHEMICAL',
        'PHYSICAL', 'ASTRONOMICAL', 'MATHEMATICAL', 'STATISTICAL', 'PROBABILISTIC',
        'CALCULUS', 'ALGEBRAIC', 'GEOMETRIC', 'TRIGONOMETRIC', 'TOPOLOGICAL',
        'ANALYTICAL', 'SYNTHETIC', 'HYPOTHETICAL', 'THETICAL', 'ANTITHETICAL',
        'PARENTHETICAL', 'METATHETICAL', 'PROSTHETICAL', 'SYNTHETICAL',
        // 9 letters
        'JUXTAPOSE', 'QUIZZINGS', 'JAZZLIKES', 'XYLOPHONS', 'WIZARDRYS', 'ZEPHYRS',
        // 10 letters
        'JUXTAPOSES', 'QUIZZINGS', 'JAZZLIKES', 'XYLOPHONS', 'WIZARDRYS', 'ZEPHYRS',
        'PHILOSOPHICAL', 'PSYCHOLOGICAL', 'SOCIOLOGICAL', 'ANTHROPOLOGICAL',
        'ARCHAEOLOGICAL', 'METEOROLOGICAL', 'GEOLOGICAL', 'BIOLOGICAL', 'CHEMICAL',
        'PHYSICAL', 'ASTRONOMICAL', 'MATHEMATICAL', 'STATISTICAL', 'PROBABILISTIC',
        'PHOTOGRAPHIC', 'PHOTOGRAPHIC', 'PHOTOGRAPHIC', 'PHOTOSYNTHETIC', 'PHOTOCHEMICAL',
        'PSYCHOLOGICAL', 'PHILOSOPHICAL', 'SOCIOLOGICAL', 'ANTHROPOLOGICAL',
        'ARCHAEOLOGICAL', 'METEOROLOGICAL', 'GEOLOGICAL', 'BIOLOGICAL', 'CHEMICAL',
        'PHYSICAL', 'ASTRONOMICAL', 'MATHEMATICAL', 'STATISTICAL', 'PROBABILISTIC',
        'CALCULUS', 'ALGEBRAIC', 'GEOMETRIC', 'TRIGONOMETRIC', 'TOPOLOGICAL',
        'ANALYTICAL', 'SYNTHETIC', 'HYPOTHETICAL', 'THETICAL', 'ANTITHETICAL',
        'PARENTHETICAL', 'METATHETICAL', 'PROSTHETICAL', 'SYNTHETICAL'
      ]
    };

    const availableWords = wordSets[difficulty];
    
    // Filter out recently used words
    let candidateWords = availableWords.filter(word => !this.usedWords.includes(word));
    
    // If we've used too many words, reset the used words list
    if (this.usedWords.length >= this.MAX_WORDS_BEFORE_REPEAT) {
      this.usedWords = [];
      candidateWords = availableWords; // Use all words again
    }
    
    // If no candidates available (shouldn't happen with our word sets), use all words
    if (candidateWords.length === 0) {
      candidateWords = availableWords;
    }
    
    const targetWord = candidateWords[Math.floor(Math.random() * candidateWords.length)];
    
    // Add to used words list
    this.usedWords.push(targetWord);
    
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
    
    // Bonus for finding the target word (advances player)
    if (word === puzzle.targetWord) {
      points += 100; // Huge bonus for completing the puzzle
    } else {
      // Bonus points for smaller words made from the main word
      if (wordLength >= 6) {
        points += 10; // Big bonus for 6+ letter words
      } else if (wordLength >= 5) {
        points += 5; // Bonus for 5-letter words
      } else if (wordLength >= 4) {
        points += 2; // Small bonus for 4-letter words
      } else if (wordLength >= 3) {
        points += 1; // Tiny bonus for 3-letter words
      }
    }

    return {
      word,
      points,
      isBonus: word === puzzle.targetWord || wordLength >= 4
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
