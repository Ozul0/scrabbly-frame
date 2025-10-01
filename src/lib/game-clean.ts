import { DictionaryService } from './dictionary';

export interface Puzzle {
  id: string;
  letters: string[];
  targetWord: string;
  createdAt: Date;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface WordValidation {
  isValid: boolean;
  reason?: string;
  isTargetWord?: boolean;
  score?: number;
}

export interface WordScore {
  points: number;
  bonus: string;
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
    const wordSets = {
      easy: [
        // 7 letters only
        'PICTURE', 'STUDENT', 'TEACHER', 'WINTERS', 'SUMMERS', 'FLOWERS', 'GARDENS',
        'FRIENDS', 'HAPPILY', 'QUICKLY', 'WEATHER', 'MORNING', 'VACATION', 'HOLIDAY',
        'BIRTHDAY', 'WEEKEND', 'PURPOSE', 'COUNTRY', 'FUTURE', 'PRESENT', 'PASSION',
        'FASHION', 'MISSION', 'VERSION', 'SERVICE', 'PARKING', 'RUNNING', 'SINGING',
        'DANCING', 'SWIMMING', 'COOKING', 'READING', 'WRITING', 'DRIVING', 'WORKING',
        'LEARNING', 'TEACHING', 'HELPING', 'SHARING', 'CARING', 'LOVING', 'LIVING',
        'GIVING', 'TAKING', 'MAKING', 'BREAKING', 'CREATING', 'DESIGNING', 'BUILDING',
        'PLANNING', 'STARTING', 'FINISHING', 'BEGINNING', 'ENDING', 'CHANGING',
        'GROWING', 'IMPROVING', 'DEVELOPING', 'ADVENTURE', 'TRAVELING', 'VISITING',
        'COMPUTER', 'HOSPITAL', 'LIBRARY', 'SCHOOL', 'COLLEGE', 'MOUNTAIN', 'OCEAN',
        'FOREST', 'DESERT', 'RIVER', 'VALLEY', 'WEDDING', 'EVENING', 'AFTERNOON',
        'NIGHTTIME', 'DAYTIME', 'SUNRISE', 'SUNSET', 'SUNSHINE', 'MOONLIGHT',
        'STARLIGHT', 'RAINBOW', 'THUNDER', 'LIGHTNING', 'CREATURE', 'ANIMAL',
        'WONDERED', 'EXPLORED', 'DISCOVERED', 'CREATED', 'DESIGNED', 'HAPPIEST',
        'FAVORITE', 'PERFECT', 'WONDERFUL', 'BEAUTIFUL', 'AMAZING', 'FANTASTIC',
        'TERRIFIC', 'EXCELLENT', 'MARVELOUS', 'SPLENDID', 'MAGNIFICENT', 'SPECTACULAR',
        'OUTSTANDING', 'KNOWLEDGE', 'EDUCATION', 'LEARNING', 'TEACHING', 'STUDYING',
        'RESEARCHING', 'INVESTIGATING', 'EXAMINING', 'ANALYZING', 'UNDERSTANDING',
        'COMPREHENDING', 'DEVELOPING', 'IMPROVING', 'ENHANCING', 'ADVANCING',
        'PROGRESSING', 'ACHIEVING', 'SUCCEEDING', 'ACCOMPLISHING', 'COMPLETING',
        'FINISHING', 'FULFILLING', 'SATISFYING', 'PLEASING', 'DELIGHTING',
        'ASTONISHING', 'SURPRISING'
      ],
      medium: [
        // 7 letters only
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
        'OBSERVATION', 'EXPERIMENTATION', 'TESTING', 'TRIAL', 'EXPERIMENT', 'DEMONSTRATION'
      ],
      hard: [
        // 7 letters only
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

  private generatePuzzleId(): string {
    return `puzzle_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  async validateWord(word: string, puzzle: Puzzle): Promise<WordValidation> {
    const normalizedWord = word.trim().toUpperCase();
    
    if (!normalizedWord) {
      return { isValid: false, reason: 'Please enter a word' };
    }

    if (normalizedWord.length < 2) {
      return { isValid: false, reason: 'Word must be at least 2 letters long' };
    }

    // Check if word can be made from puzzle letters
    if (!this.canMakeWord(normalizedWord, puzzle.letters)) {
      return { isValid: false, reason: 'Word cannot be made from available letters' };
    }

    // Check if word is in dictionary
    const isValidDictionary = await this.dictionaryService.isValidWord(normalizedWord);
    if (!isValidDictionary) {
      return { isValid: false, reason: 'Word not found in dictionary' };
    }

    // Check if it's the target word
    const isTargetWord = normalizedWord === puzzle.targetWord;

    return {
      isValid: true,
      isTargetWord,
      score: this.calculateWordScore(normalizedWord, puzzle).points
    };
  }

  private canMakeWord(word: string, availableLetters: string[]): boolean {
    const letterCounts: { [key: string]: number } = {};
    
    // Count available letters
    availableLetters.forEach(letter => {
      letterCounts[letter] = (letterCounts[letter] || 0) + 1;
    });
    
    // Check if word can be made
    for (const letter of word) {
      if (!letterCounts[letter] || letterCounts[letter] <= 0) {
        return false;
      }
      letterCounts[letter]--;
    }
    
    return true;
  }

  calculateWordScore(word: string, puzzle: Puzzle): WordScore {
    const basePoints = word.length;
    let bonus = '';
    let multiplier = 1;

    // Bonus for longer words
    if (word.length >= 5) {
      multiplier = 2;
      bonus = 'Long word bonus';
    }
    
    // Special bonus for 7-letter words
    if (word.length === 7) {
      multiplier = 3;
      bonus = 'Perfect 7-letter word!';
    }
    
    // Pangram bonus (uses all letters)
    if (this.isPangram(word, puzzle.letters)) {
      multiplier = 4;
      bonus = 'Pangram bonus!';
    }

    return {
      points: basePoints * multiplier,
      bonus
    };
  }

  private isPangram(word: string, letters: string[]): boolean {
    const uniqueLetters = new Set(letters);
    const wordLetters = new Set(word.split(''));
    return uniqueLetters.size === wordLetters.size && 
           Array.from(uniqueLetters).every(letter => wordLetters.has(letter));
  }
}
