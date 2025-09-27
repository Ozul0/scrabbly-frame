'use client';

import { useState } from 'react';

interface Puzzle {
  id: string;
  letters: string[];
  targetWord: string;
  difficulty: string;
}

export default function TestPage() {
  const [currentPuzzle, setCurrentPuzzle] = useState<Puzzle | null>(null);
  const [wordInput, setWordInput] = useState('');
  const [validationResult, setValidationResult] = useState('');
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [score, setScore] = useState(0);

  const generatePuzzle = () => {
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

    const availableWords = wordSets.medium;
    const targetWord = availableWords[Math.floor(Math.random() * availableWords.length)];
    
    // Shuffle the letters of the target word
    const shuffledLetters = targetWord.split('').sort(() => Math.random() - 0.5);
    
    const puzzle: Puzzle = {
      id: 'test_' + Date.now(),
      letters: shuffledLetters,
      targetWord: targetWord,
      difficulty: 'medium'
    };

    setCurrentPuzzle(puzzle);
    setValidationResult('');
    setFoundWords([]);
    setScore(0);
  };

  const validateWord = async () => {
    if (!currentPuzzle || !wordInput.trim()) {
      setValidationResult('Please enter a word');
      return;
    }

    const word = wordInput.trim().toUpperCase();
    
    // Check if word is the target word (7-letter word) - this advances the player
    if (word === currentPuzzle.targetWord) {
      setValidationResult(`🎉 Excellent! You found "${word}"! Moving to next puzzle!`);
      const newScore = score + word.length + 50; // Big bonus for target word
      setScore(newScore);
      setFoundWords([...foundWords, word]);
      setWordInput('');
      
      // Auto-generate next puzzle after a delay
      setTimeout(() => {
        generatePuzzle();
      }, 2000);
      return;
    }
    
    // Check if word is too short
    if (word.length < 3) {
      setValidationResult('Word must be at least 3 letters long');
      return;
    }

    // Check if word can be formed from available letters
    const availableLetters = [...currentPuzzle.letters];
    for (const letter of word) {
      const index = availableLetters.indexOf(letter);
      if (index === -1) {
        setValidationResult(`Letter '${letter}' is not available in this puzzle`);
        return;
      }
      availableLetters.splice(index, 1); // Remove used letter
    }

    // Check if word is valid in dictionary (simplified check)
    const commonWords = [
      'CAT', 'DOG', 'HOUSE', 'CAR', 'TREE', 'BOOK', 'WATER', 'FIRE', 'EARTH',
      'AIR', 'LOVE', 'HOPE', 'DREAM', 'LIGHT', 'DARK', 'GOOD', 'BAD', 'BIG',
      'SMALL', 'FAST', 'SLOW', 'HOT', 'COLD', 'NEW', 'OLD', 'YOUNG', 'HAPPY',
      'SAD', 'ANGRY', 'CALM', 'PEACE', 'WAR', 'LIFE', 'DEATH', 'TIME', 'SPACE',
      'RUN', 'WALK', 'JUMP', 'SING', 'DANCE', 'PLAY', 'WORK', 'SLEEP', 'EAT',
      'DRINK', 'READ', 'WRITE', 'HEAR', 'SEE', 'FEEL', 'TOUCH', 'SMELL', 'TASTE'
    ];

    if (!commonWords.includes(word)) {
      setValidationResult(`${word} is not a recognized English word`);
      return;
    }

    // Word is valid
    let wordScore = word.length; // Base points = word length
    
    if (word.length >= 6) {
      wordScore += 5; // Bonus for longer words
    } else if (word.length >= 5) {
      wordScore += 2; // Small bonus for 5-letter words
    }

    const newScore = score + wordScore;
    setScore(newScore);
    setFoundWords([...foundWords, word]);
    setValidationResult(`✅ Valid! "${word}" earned ${wordScore} points!`);
    setWordInput('');
  };

  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif',
      maxWidth: '100%',
      margin: '0 auto'
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '20px',
        borderRadius: '15px',
        textAlign: 'center',
        marginBottom: '20px'
      }}>
        <h1 style={{ margin: '0 0 10px 0', fontSize: '24px' }}>🎯 ScraBBly Frame Testing</h1>
        <p style={{ margin: '0', fontSize: '14px', opacity: '0.9' }}>
          7-letter word scramble game! Find words from scrambled letters. Find the 7-letter word to advance to the next puzzle!
        </p>
      </div>
      
      <div style={{
        background: 'white',
        padding: '20px',
        borderRadius: '15px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        marginBottom: '20px'
      }}>
        <h2 style={{ color: '#333', marginBottom: '15px' }}>1. Generate 7-Letter Puzzle</h2>
        <button 
          onClick={generatePuzzle}
          style={{
            background: '#667eea',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            marginBottom: '20px'
          }}
        >
          Generate New Puzzle
        </button>
        
        {currentPuzzle && (
          <div>
            <h3 style={{ color: '#333', marginBottom: '15px' }}>Generated Puzzle:</h3>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '8px',
              marginBottom: '15px',
              flexWrap: 'wrap'
            }}>
              {currentPuzzle.letters.map((letter, index) => (
                <div key={index} style={{
                  width: '40px',
                  height: '40px',
                  background: '#667eea',
                  color: 'white',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }}>
                  {letter}
                </div>
              ))}
            </div>
            <div style={{
              background: '#fff3cd',
              color: '#856404',
              padding: '10px',
              borderRadius: '8px',
              marginBottom: '10px',
              fontSize: '14px',
              fontWeight: 'bold'
            }}>
              🎯 Find the 7-letter word: {currentPuzzle.targetWord}
            </div>
            <p style={{ margin: '5px 0', color: '#666' }}>
              <strong>Target Word:</strong> {currentPuzzle.targetWord}
            </p>
            <p style={{ margin: '5px 0', color: '#666' }}>
              <strong>Difficulty:</strong> {currentPuzzle.difficulty}
            </p>
            <p style={{ margin: '15px 0', color: '#666' }}>
              <strong>Score:</strong> {score} points
            </p>
            {foundWords.length > 0 && (
              <div style={{
                background: '#e8f5e8',
                color: '#2d5a2d',
                padding: '10px',
                borderRadius: '8px',
                marginTop: '10px',
                fontSize: '14px'
              }}>
                <strong>Found Words:</strong> {foundWords.join(', ')}
              </div>
            )}
          </div>
        )}
      </div>
      
      <div style={{
        background: 'white',
        padding: '20px',
        borderRadius: '15px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        marginBottom: '20px'
      }}>
        <h2 style={{ color: '#333', marginBottom: '15px' }}>2. Test Word Validation</h2>
        <div style={{ marginBottom: '15px' }}>
          <input
            type="text"
            value={wordInput}
            onChange={(e) => setWordInput(e.target.value)}
            placeholder="Enter a word..."
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #ddd',
              borderRadius: '8px',
              fontSize: '16px',
              marginBottom: '10px'
            }}
            onKeyPress={(e) => e.key === 'Enter' && validateWord()}
          />
          <button 
            onClick={validateWord}
            style={{
              background: '#28a745',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              width: '100%'
            }}
          >
            Validate Word
          </button>
        </div>
        
        {validationResult && (
          <div style={{
            padding: '12px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 'bold',
            backgroundColor: validationResult.includes('✅') || validationResult.includes('🎉') 
              ? '#d4edda' 
              : validationResult.includes('❌') 
                ? '#f8d7da' 
                : '#fff3cd',
            color: validationResult.includes('✅') || validationResult.includes('🎉')
              ? '#155724'
              : validationResult.includes('❌')
                ? '#721c24'
                : '#856404',
            border: `1px solid ${
              validationResult.includes('✅') || validationResult.includes('🎉')
                ? '#c3e6cb'
                : validationResult.includes('❌')
                  ? '#f5c6cb'
                  : '#ffeaa7'
            }`
          }}>
            {validationResult.includes('✅') || validationResult.includes('🎉') ? '✅' : '❌'} {validationResult}
          </div>
        )}
      </div>
      
      <div style={{
        background: 'white',
        padding: '20px',
        borderRadius: '15px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ color: '#333', marginBottom: '15px' }}>3. Frame URLs</h2>
        <div style={{ fontSize: '14px', color: '#666' }}>
          <p><strong>Main Frame:</strong> <code>/api/frame</code></p>
          <p><strong>Game Image:</strong> <code>/api/game-image</code></p>
          <p><strong>Leaderboard:</strong> <code>/api/leaderboard-image</code></p>
        </div>
      </div>
      
      <style jsx>{`
        @media (max-width: 480px) {
          .container {
            padding: 10px;
          }
          
          h1 {
            font-size: 20px;
          }
          
          .letters {
            gap: 6px;
          }
          
          .letter {
            width: 35px;
            height: 35px;
            font-size: 16px;
          }
        }
      `}</style>
    </div>
  );
}