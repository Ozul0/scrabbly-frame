// Utility functions for ScraBBly Frame

export function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function formatScore(score: number): string {
  if (score >= 1000) {
    return `${(score / 1000).toFixed(1)}k`;
  }
  return score.toString();
}

export function getDifficultyColor(difficulty: 'easy' | 'medium' | 'hard'): string {
  switch (difficulty) {
    case 'easy':
      return '#4ade80'; // green
    case 'medium':
      return '#fbbf24'; // yellow
    case 'hard':
      return '#f87171'; // red
    default:
      return '#6b7280'; // gray
  }
}

export function getDifficultyEmoji(difficulty: 'easy' | 'medium' | 'hard'): string {
  switch (difficulty) {
    case 'easy':
      return '🟢';
    case 'medium':
      return '🟡';
    case 'hard':
      return '🔴';
    default:
      return '⚪';
  }
}

export function calculateWordComplexity(word: string): number {
  // Simple complexity calculation based on word characteristics
  let complexity = 0;
  
  // Length factor
  complexity += word.length * 0.5;
  
  // Vowel/consonant ratio
  const vowels = word.match(/[AEIOU]/g)?.length || 0;
  const consonants = word.length - vowels;
  const ratio = vowels / consonants;
  
  if (ratio < 0.3) complexity += 2; // Too many consonants
  if (ratio > 0.7) complexity += 1; // Too many vowels
  
  // Repeated letters
  const uniqueLetters = new Set(word.split(''));
  if (uniqueLetters.size < word.length * 0.7) {
    complexity += 1; // Many repeated letters
  }
  
  // Special letters (Q, X, Z)
  if (word.includes('Q') || word.includes('X') || word.includes('Z')) {
    complexity += 1;
  }
  
  return Math.round(complexity);
}

export function generateHint(puzzle: { letters: string[]; centerLetter: string }): string {
  const hints = [
    `Try words that start with ${puzzle.centerLetter}`,
    `Look for common letter combinations like 'TH' or 'ING'`,
    `Don't forget to use the center letter ${puzzle.centerLetter}`,
    `Try different word lengths - longer words score more!`,
    `Look for prefixes like 'UN-' or suffixes like '-ING'`,
    `Think of categories: animals, food, places, actions`,
  ];
  
  return hints[Math.floor(Math.random() * hints.length)];
}

export function validateFrameData(data: any): boolean {
  // Basic validation for Farcaster Frame data
  return (
    data &&
    typeof data === 'object' &&
    data.untrustedData &&
    typeof data.untrustedData.fid === 'number' &&
    typeof data.untrustedData.buttonIndex === 'number'
  );
}

export function sanitizeInput(input: string): string {
  // Sanitize user input for word validation
  return input
    .trim()
    .toUpperCase()
    .replace(/[^A-Z]/g, ''); // Remove non-letter characters
}

export function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }
}

export function generatePuzzleId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  return `puzzle_${timestamp}_${random}`;
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
