'use client';

import { useState } from 'react';

interface Puzzle {
  id: string;
  letters: string[];
  centerLetter: string;
  difficulty: string;
}

export default function TestPage() {
  const [currentPuzzle, setCurrentPuzzle] = useState<Puzzle | null>(null);
  const [wordInput, setWordInput] = useState('');
  const [validationResult, setValidationResult] = useState('');

  const generatePuzzle = () => {
    // Generate 7 random letters with good word-forming potential
    const letterSets = {
      easy: ['A', 'E', 'I', 'O', 'U', 'R', 'S', 'T', 'L', 'N', 'D', 'G', 'B', 'C', 'M', 'P', 'F', 'H', 'V', 'W', 'Y'],
      medium: ['A', 'E', 'I', 'O', 'U', 'R', 'S', 'T', 'L', 'N', 'D', 'G', 'B', 'C', 'M', 'P', 'F', 'H', 'V', 'W', 'Y', 'K', 'J', 'X', 'Q', 'Z'],
      hard: ['A', 'E', 'I', 'O', 'U', 'R', 'S', 'T', 'L', 'N', 'D', 'G', 'B', 'C', 'M', 'P', 'F', 'H', 'V', 'W', 'Y', 'K', 'J', 'X', 'Q', 'Z']
    };
    
    const availableLetters = letterSets.medium;
    const selectedLetters = [];
    
    // Ensure we have at least one vowel
    const vowels = ['A', 'E', 'I', 'O', 'U'];
    selectedLetters.push(vowels[Math.floor(Math.random() * vowels.length)]);
    
    // Add 6 more letters
    while (selectedLetters.length < 7) {
      const randomLetter = availableLetters[Math.floor(Math.random() * availableLetters.length)];
      if (!selectedLetters.includes(randomLetter)) {
        selectedLetters.push(randomLetter);
      }
    }
    
    const shuffled = selectedLetters.sort(() => Math.random() - 0.5);
    
    const puzzle: Puzzle = {
      id: 'test_' + Date.now(),
      letters: shuffled,
      centerLetter: shuffled[0], // First letter is the center
      difficulty: 'medium'
    };

    setCurrentPuzzle(puzzle);
    setValidationResult('');
  };

  const validateWord = () => {
    if (!currentPuzzle) {
      setValidationResult('Please generate a puzzle first!');
      return;
    }

    const word = wordInput.toUpperCase().trim();
    
    if (word.length < 3) {
      setValidationResult('Word must be at least 3 letters long');
      return;
    }

    // Check if word contains only letters from puzzle (with proper counting)
    const puzzleLetters = [...currentPuzzle.letters];
    const wordLetters = [...word];
    let isValid = true;
    let reason = '';

    // Check if word uses the center letter
    if (!word.includes(currentPuzzle.centerLetter)) {
      isValid = false;
      reason = `Word must contain the center letter '${currentPuzzle.centerLetter}'`;
    } else {
      // Check if we can form the word with available letters
      const availableLetters = [...puzzleLetters];
      for (const letter of wordLetters) {
        const index = availableLetters.indexOf(letter);
        if (index === -1) {
          isValid = false;
          reason = `Letter '${letter}' is not available in this puzzle`;
          break;
        }
        availableLetters.splice(index, 1); // Remove used letter
      }
    }

    // Basic dictionary check (simplified for demo)
    if (isValid) {
      const commonWords = [
        'CAT', 'DOG', 'HOUSE', 'CAR', 'TREE', 'BOOK', 'WATER', 'FIRE', 'EARTH',
        'AIR', 'LOVE', 'HOPE', 'DREAM', 'LIGHT', 'DARK', 'GOOD', 'BAD', 'BIG',
        'SMALL', 'FAST', 'SLOW', 'HOT', 'COLD', 'NEW', 'OLD', 'YOUNG', 'HAPPY',
        'SAD', 'ANGRY', 'CALM', 'PEACE', 'WAR', 'LIFE', 'DEATH', 'TIME', 'SPACE',
        'MOON', 'SUN', 'STAR', 'SKY', 'SEA', 'LAND', 'MOUNTAIN', 'RIVER', 'LAKE',
        'FOREST', 'DESERT', 'CITY', 'TOWN', 'VILLAGE', 'COUNTRY', 'WORLD', 'EARTH',
        'PLANET', 'UNIVERSE', 'GOD', 'SPIRIT', 'SOUL', 'MIND', 'BODY', 'HEART',
        'HAND', 'FOOT', 'EYE', 'EAR', 'NOSE', 'MOUTH', 'TOOTH', 'HAIR', 'SKIN',
        'BONE', 'BLOOD', 'FLESH', 'MUSCLE', 'BRAIN', 'LUNG', 'HEART', 'LIVER',
        'KIDNEY', 'STOMACH', 'INTESTINE', 'VEIN', 'ARTERY', 'NERVE', 'CELL',
        'ATOM', 'MOLECULE', 'ELEMENT', 'COMPOUND', 'MIXTURE', 'SOLUTION',
        'SOLID', 'LIQUID', 'GAS', 'PLASMA', 'ENERGY', 'FORCE', 'POWER',
        'STRENGTH', 'WEAKNESS', 'COURAGE', 'FEAR', 'BRAVERY', 'COWARDICE',
        'HONESTY', 'DISHONESTY', 'TRUTH', 'LIE', 'FACT', 'FICTION', 'REALITY',
        'FANTASY', 'IMAGINATION', 'CREATIVITY', 'ART', 'MUSIC', 'DANCE',
        'POETRY', 'PROSE', 'STORY', 'TALE', 'LEGEND', 'MYTH', 'HISTORY',
        'FUTURE', 'PAST', 'PRESENT', 'NOW', 'THEN', 'WHEN', 'WHERE', 'WHY',
        'HOW', 'WHAT', 'WHO', 'WHICH', 'WHOSE', 'WHOM', 'THIS', 'THAT',
        'THESE', 'THOSE', 'HERE', 'THERE', 'EVERYWHERE', 'NOWHERE', 'SOMEWHERE',
        'ANYWHERE', 'ALWAYS', 'NEVER', 'SOMETIMES', 'OFTEN', 'RARELY', 'SELDOM',
        'USUALLY', 'NORMALLY', 'TYPICALLY', 'GENERALLY', 'SPECIFICALLY',
        'PARTICULARLY', 'ESPECIALLY', 'MAINLY', 'MOSTLY', 'PARTLY', 'COMPLETELY',
        'TOTALLY', 'ENTIRELY', 'FULLY', 'HALF', 'QUARTER', 'THIRD', 'DOUBLE',
        'TRIPLE', 'SINGLE', 'MULTIPLE', 'MANY', 'FEW', 'SEVERAL', 'SOME',
        'ANY', 'ALL', 'NONE', 'NOTHING', 'SOMETHING', 'EVERYTHING', 'ANYTHING'
      ];
      
      if (!commonWords.includes(word)) {
        isValid = false;
        reason = `"${word}" is not a recognized English word`;
      }
    }

    // Enhanced scoring system for 7-letter word game
    let score = 0;
    if (isValid) {
      score = word.length; // Base score = word length
      
      // Bonus for longer words
      if (word.length >= 7) {
        score += 10; // Big bonus for 7-letter words
      } else if (word.length >= 5) {
        score += 3; // Bonus for 5+ letter words
      }
      
      // Special bonus for using all 7 letters (pangram)
      if (word.length === 7) {
        const uniqueLetters = new Set(word.split(''));
        const puzzleLetters = new Set(currentPuzzle.letters);
        const isPangram = uniqueLetters.size === puzzleLetters.size && 
                         Array.from(uniqueLetters).every(letter => puzzleLetters.has(letter));
        if (isPangram) {
          score += 20; // Huge bonus for 7-letter pangram
        }
      }
    }

    setValidationResult(
      isValid 
        ? `✅ Valid! "${word}" earned ${score} points!`
        : `❌ Invalid: ${reason}`
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-4">
      <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center text-white">
        <h1 className="text-4xl font-bold mb-4">🎯 ScraBBly Frame Testing</h1>
        <p className="text-lg mb-6">
          Classic 7-letter word game! Make words from 7 random letters. 
          Try to find the longest word possible - bonus points for 7-letter words!
        </p>
        
        <div className="space-y-6">
          <div className="bg-white/20 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">1. Generate 7-Letter Puzzle</h3>
            <button 
              onClick={generatePuzzle}
              className="bg-cyan-400 hover:bg-cyan-500 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
              Generate New Puzzle
            </button>
            {currentPuzzle && (
              <div className="mt-4">
                <h4 className="text-lg font-semibold mb-2">Generated Puzzle:</h4>
                <div className="flex flex-wrap justify-center gap-3 mb-4">
                  {currentPuzzle.letters.map((letter, index) => (
                    <div 
                      key={index}
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold ${
                        index === 0 ? 'bg-cyan-400 scale-110' : 'bg-red-400'
                      } text-white shadow-lg`}
                    >
                      {letter}
                    </div>
                  ))}
                </div>
                <p className="text-sm">
                  <strong>Center Letter:</strong> {currentPuzzle.centerLetter}
                </p>
                <p className="text-sm">
                  <strong>Difficulty:</strong> {currentPuzzle.difficulty}
                </p>
              </div>
            )}
          </div>

          <div className="bg-white/20 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">2. Test Word Validation</h3>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={wordInput}
                onChange={(e) => setWordInput(e.target.value)}
                placeholder="Enter a word to test"
                className="flex-1 px-3 py-2 rounded-lg border-0 text-gray-800"
                onKeyPress={(e) => e.key === 'Enter' && validateWord()}
              />
              <button 
                onClick={validateWord}
                className="bg-cyan-400 hover:bg-cyan-500 text-white font-bold py-2 px-4 rounded-lg transition-colors"
              >
                Validate Word
              </button>
            </div>
            {validationResult && (
              <div className={`p-3 rounded-lg ${
                validationResult.includes('✅') ? 'bg-green-500/20' : 'bg-red-500/20'
              }`}>
                <p className="font-semibold">{validationResult}</p>
              </div>
            )}
          </div>

          <div className="bg-white/20 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">3. Frame URLs</h3>
            <div className="space-y-2 text-sm">
              <p><strong>Main Frame:</strong> <a href="/api/frame" className="text-cyan-300 hover:underline" target="_blank">/api/frame</a></p>
              <p><strong>Game Image:</strong> <a href="/api/game-image?letters=CATSER&score=0&found=" className="text-cyan-300 hover:underline" target="_blank">/api/game-image</a></p>
              <p><strong>Leaderboard:</strong> <a href="/api/leaderboard-image" className="text-cyan-300 hover:underline" target="_blank">/api/leaderboard-image</a></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
