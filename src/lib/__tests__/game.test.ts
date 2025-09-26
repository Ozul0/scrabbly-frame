// Test file for ScraBBly game logic
import { ScraBBlyGame } from '../game';

describe('ScraBBlyGame', () => {
  let game: ScraBBlyGame;

  beforeEach(() => {
    game = ScraBBlyGame.getInstance();
  });

  describe('generatePuzzle', () => {
    it('should generate a puzzle with correct number of letters', () => {
      const puzzle = game.generatePuzzle('easy');
      expect(puzzle.letters).toHaveLength(5);
      
      const mediumPuzzle = game.generatePuzzle('medium');
      expect(mediumPuzzle.letters).toHaveLength(6);
      
      const hardPuzzle = game.generatePuzzle('hard');
      expect(hardPuzzle.letters).toHaveLength(7);
    });

    it('should have a center letter', () => {
      const puzzle = game.generatePuzzle('medium');
      expect(puzzle.centerLetter).toBeDefined();
      expect(puzzle.letters).toContain(puzzle.centerLetter);
    });

    it('should have a unique ID', () => {
      const puzzle1 = game.generatePuzzle('medium');
      const puzzle2 = game.generatePuzzle('medium');
      expect(puzzle1.id).not.toBe(puzzle2.id);
    });
  });

  describe('validateWord', () => {
    const puzzle = {
      id: 'test',
      letters: ['C', 'A', 'T', 'S', 'E'],
      centerLetter: 'C',
      createdAt: new Date(),
      difficulty: 'easy' as const
    };

    it('should reject words that are too short', async () => {
      const result = await game.validateWord('CA', puzzle);
      expect(result.isValid).toBe(false);
      expect(result.reason).toContain('at least 3 letters');
    });

    it('should reject words with invalid letters', async () => {
      const result = await game.validateWord('DOG', puzzle);
      expect(result.isValid).toBe(false);
      expect(result.reason).toContain('not available');
    });

    it('should reject words without center letter', async () => {
      const result = await game.validateWord('ATE', puzzle);
      expect(result.isValid).toBe(false);
      expect(result.reason).toContain('center letter');
    });

    it('should accept valid words', async () => {
      const result = await game.validateWord('CAT', puzzle);
      expect(result.isValid).toBe(true);
    });
  });

  describe('calculateWordScore', () => {
    const puzzle = {
      id: 'test',
      letters: ['C', 'A', 'T', 'S', 'E'],
      centerLetter: 'C',
      createdAt: new Date(),
      difficulty: 'easy' as const
    };

    it('should calculate base score correctly', () => {
      const score = game.calculateWordScore('CAT', puzzle);
      expect(score.points).toBe(3); // Base score = word length
    });

    it('should give bonus for longer words', () => {
      const score = game.calculateWordScore('CAST', puzzle);
      expect(score.points).toBeGreaterThan(4); // Base + bonus
    });

    it('should mark bonus words correctly', () => {
      const shortScore = game.calculateWordScore('CAT', puzzle);
      expect(shortScore.isBonus).toBe(false);
      
      const longScore = game.calculateWordScore('CAST', puzzle);
      expect(longScore.isBonus).toBe(true);
    });
  });

  describe('canFormWord', () => {
    const puzzle = {
      id: 'test',
      letters: ['C', 'A', 'T', 'S', 'E'],
      centerLetter: 'C',
      createdAt: new Date(),
      difficulty: 'easy' as const
    };

    it('should return true for valid word formations', () => {
      expect(game.canFormWord('CAT', puzzle)).toBe(true);
      expect(game.canFormWord('CAST', puzzle)).toBe(true);
      expect(game.canFormWord('CASE', puzzle)).toBe(true);
    });

    it('should return false for invalid word formations', () => {
      expect(game.canFormWord('DOG', puzzle)).toBe(false);
      expect(game.canFormWord('CATS', puzzle)).toBe(false); // Uses S twice
    });
  });
});
