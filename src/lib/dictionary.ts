// Dictionary service for word validation
export interface DictionaryResponse {
  word: string;
  phonetic?: string;
  meanings: Array<{
    partOfSpeech: string;
    definitions: Array<{
      definition: string;
      example?: string;
    }>;
  }>;
}

export class DictionaryService {
  private static instance: DictionaryService;
  private cache: Map<string, boolean> = new Map();

  static getInstance(): DictionaryService {
    if (!DictionaryService.instance) {
      DictionaryService.instance = new DictionaryService();
    }
    return DictionaryService.instance;
  }

  async isValidWord(word: string): Promise<boolean> {
    const normalizedWord = word.toLowerCase().trim();
    
    // Check cache first
    if (this.cache.has(normalizedWord)) {
      return this.cache.get(normalizedWord)!;
    }

    try {
      // Use Free Dictionary API
      const response = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${normalizedWord}`
      );
      
      const isValid = response.ok;
      this.cache.set(normalizedWord, isValid);
      
      return isValid;
    } catch (error) {
      console.error('Dictionary API error:', error);
      // Fallback: basic validation for common words
      return this.fallbackValidation(normalizedWord);
    }
  }

  private fallbackValidation(word: string): boolean {
    // Basic fallback for common English words
    const commonWords = [
      'cat', 'dog', 'house', 'car', 'tree', 'book', 'water', 'fire', 'earth',
      'air', 'love', 'hope', 'dream', 'light', 'dark', 'good', 'bad', 'big',
      'small', 'fast', 'slow', 'hot', 'cold', 'new', 'old', 'young', 'happy',
      'sad', 'angry', 'calm', 'peace', 'war', 'life', 'death', 'time', 'space',
      'moon', 'sun', 'star', 'sky', 'sea', 'land', 'mountain', 'river', 'lake',
      'forest', 'desert', 'city', 'town', 'village', 'country', 'world', 'earth',
      'planet', 'universe', 'god', 'spirit', 'soul', 'mind', 'body', 'heart',
      'hand', 'foot', 'eye', 'ear', 'nose', 'mouth', 'tooth', 'hair', 'skin',
      'bone', 'blood', 'flesh', 'muscle', 'brain', 'lung', 'heart', 'liver',
      'kidney', 'stomach', 'intestine', 'vein', 'artery', 'nerve', 'cell',
      'atom', 'molecule', 'element', 'compound', 'mixture', 'solution',
      'solid', 'liquid', 'gas', 'plasma', 'energy', 'force', 'power',
      'strength', 'weakness', 'courage', 'fear', 'bravery', 'cowardice',
      'honesty', 'dishonesty', 'truth', 'lie', 'fact', 'fiction', 'reality',
      'fantasy', 'imagination', 'creativity', 'art', 'music', 'dance',
      'poetry', 'prose', 'story', 'tale', 'legend', 'myth', 'history',
      'future', 'past', 'present', 'now', 'then', 'when', 'where', 'why',
      'how', 'what', 'who', 'which', 'whose', 'whom', 'this', 'that',
      'these', 'those', 'here', 'there', 'everywhere', 'nowhere', 'somewhere',
      'anywhere', 'always', 'never', 'sometimes', 'often', 'rarely', 'seldom',
      'usually', 'normally', 'typically', 'generally', 'specifically',
      'particularly', 'especially', 'mainly', 'mostly', 'partly', 'completely',
      'totally', 'entirely', 'fully', 'half', 'quarter', 'third', 'double',
      'triple', 'single', 'multiple', 'many', 'few', 'several', 'some',
      'any', 'all', 'none', 'nothing', 'something', 'everything', 'anything'
    ];
    
    return commonWords.includes(word);
  }

  clearCache(): void {
    this.cache.clear();
  }
}
