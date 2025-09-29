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
    // Comprehensive fallback for common English words
    const commonWords = [
      // 2 letters
      'at', 'be', 'by', 'do', 'go', 'he', 'if', 'in', 'is', 'it', 'me', 'my', 'no', 'of', 'on', 'or', 'so', 'to', 'up', 'us', 'we',
      
      // 3 letters  
      'act', 'add', 'age', 'ago', 'air', 'all', 'and', 'ant', 'any', 'are', 'arm', 'art', 'ask', 'bad', 'bag', 'bar', 'bat', 'bed', 'bee', 'beg', 'big', 'bit', 'box', 'boy', 'bus', 'but', 'buy', 'can', 'car', 'cat', 'cow', 'cry', 'cup', 'cut', 'day', 'did', 'die', 'dig', 'dog', 'dry', 'ear', 'eat', 'egg', 'end', 'eye', 'fan', 'far', 'fat', 'few', 'fig', 'fly', 'for', 'fun', 'gas', 'get', 'got', 'gun', 'guy', 'had', 'has', 'hat', 'her', 'him', 'his', 'hit', 'hot', 'how', 'ice', 'job', 'joy', 'key', 'kid', 'kit', 'law', 'lay', 'leg', 'let', 'lie', 'lot', 'low', 'mad', 'man', 'map', 'may', 'men', 'mix', 'mom', 'mud', 'net', 'new', 'not', 'now', 'nut', 'off', 'oil', 'old', 'one', 'our', 'out', 'own', 'pan', 'pay', 'pen', 'pet', 'pie', 'pig', 'pin', 'pot', 'put', 'ran', 'red', 'rid', 'run', 'sad', 'saw', 'say', 'see', 'set', 'she', 'sit', 'six', 'sky', 'son', 'sun', 'ten', 'the', 'tie', 'too', 'top', 'try', 'two', 'use', 'war', 'was', 'way', 'wet', 'who', 'why', 'win', 'yes', 'yet', 'you', 'zip',
      
      // 4 letters
      'able', 'acid', 'aged', 'also', 'area', 'army', 'away', 'baby', 'back', 'ball', 'band', 'bank', 'base', 'bath', 'bear', 'beat', 'been', 'beer', 'bell', 'belt', 'bend', 'best', 'bike', 'bill', 'bird', 'bite', 'blue', 'boat', 'body', 'bomb', 'bone', 'book', 'boot', 'born', 'both', 'bowl', 'bulk', 'burn', 'bush', 'busy', 'call', 'calm', 'came', 'camp', 'card', 'care', 'case', 'cash', 'cast', 'cell', 'cent', 'chat', 'chef', 'chew', 'chin', 'chip', 'city', 'clay', 'clip', 'club', 'coal', 'coat', 'code', 'cold', 'come', 'cook', 'cool', 'cope', 'copy', 'core', 'corn', 'cost', 'crop', 'cube', 'cure', 'curl', 'cute', 'damp', 'dare', 'dark', 'data', 'date', 'dawn', 'days', 'dead', 'deal', 'dear', 'deep', 'deer', 'desk', 'dial', 'diet', 'dirt', 'dish', 'disk', 'dive', 'dock', 'does', 'done', 'door', 'dose', 'down', 'draw', 'drew', 'drop', 'drug', 'drum', 'dual', 'duck', 'dull', 'dumb', 'dump', 'dust', 'duty', 'each', 'earn', 'ease', 'east', 'easy', 'edge', 'edit', 'else', 'even', 'ever', 'evil', 'exit', 'face', 'fact', 'fail', 'fair', 'fall', 'fame', 'farm', 'fast', 'fate', 'fear', 'feed', 'feel', 'feet', 'fell', 'felt', 'file', 'fill', 'film', 'find', 'fine', 'fire', 'firm', 'fish', 'fist', 'five', 'flag', 'flat', 'flow', 'fold', 'folk', 'food', 'foot', 'ford', 'form', 'fort', 'four', 'free', 'frog', 'from', 'fuel', 'full', 'fund', 'gain', 'game', 'gang', 'gate', 'gave', 'gear', 'gene', 'gift', 'girl', 'give', 'glad', 'glow', 'glue', 'goal', 'goat', 'goes', 'gold', 'golf', 'gone', 'good', 'grab', 'gray', 'grew', 'grey', 'grip', 'grow', 'gulf', 'hair', 'half', 'hall', 'hand', 'hang', 'hard', 'harm', 'hate', 'have', 'head', 'hear', 'heat', 'held', 'hell', 'help', 'here', 'hero', 'hide', 'high', 'hill', 'hint', 'hire', 'hold', 'hole', 'home', 'hook', 'hope', 'horn', 'host', 'hour', 'huge', 'hunt', 'hurt', 'idea', 'inch', 'into', 'iron', 'item', 'jazz', 'join', 'joke', 'jump', 'jury', 'just', 'keep', 'kept', 'kick', 'kill', 'kind', 'king', 'kiss', 'kite', 'knee', 'knew', 'knife', 'knit', 'knot', 'know', 'lack', 'lady', 'laid', 'lake', 'lamb', 'lamp', 'land', 'lane', 'last', 'late', 'laugh', 'law', 'lay', 'lead', 'leaf', 'lean', 'leap', 'left', 'leg', 'lend', 'lens', 'less', 'let', 'lie', 'life', 'lift', 'like', 'line', 'link', 'lion', 'lip', 'list', 'live', 'load', 'loan', 'lock', 'long', 'look', 'loop', 'lord', 'lose', 'loss', 'lost', 'lot', 'loud', 'love', 'luck', 'lung', 'made', 'mail', 'main', 'make', 'male', 'mall', 'man', 'many', 'map', 'mark', 'mask', 'mass', 'mate', 'math', 'maze', 'meal', 'mean', 'meat', 'meet', 'melt', 'memo', 'menu', 'mere', 'mesh', 'mess', 'mice', 'mild', 'mile', 'milk', 'mill', 'mind', 'mine', 'mini', 'mint', 'miss', 'mist', 'mix', 'mode', 'mold', 'moon', 'more', 'most', 'move', 'much', 'must', 'name', 'navy', 'near', 'neck', 'need', 'nest', 'net', 'new', 'news', 'next', 'nice', 'nick', 'nine', 'node', 'none', 'noon', 'norm', 'nose', 'note', 'noun', 'numb', 'nuts', 'oak', 'oats', 'odds', 'off', 'oil', 'okay', 'old', 'once', 'one', 'only', 'onto', 'open', 'oral', 'ours', 'oval', 'oven', 'over', 'pace', 'pack', 'page', 'paid', 'pain', 'pair', 'pale', 'palm', 'pant', 'park', 'part', 'pass', 'past', 'path', 'peak', 'pear', 'peel', 'peer', 'pelt', 'pens', 'perk', 'pest', 'pet', 'pick', 'pier', 'pike', 'pile', 'pill', 'pine', 'pink', 'pint', 'pipe', 'pits', 'plan', 'play', 'plot', 'plug', 'plus', 'poem', 'poet', 'poke', 'pole', 'poll', 'polo', 'pond', 'pool', 'poor', 'pope', 'pork', 'port', 'pose', 'post', 'pots', 'pour', 'pray', 'prey', 'puff', 'pull', 'pump', 'punk', 'pure', 'push', 'put', 'quay', 'quit', 'quiz', 'race', 'rack', 'rage', 'raid', 'rail', 'rain', 'rake', 'ramp', 'rank', 'rare', 'rash', 'rate', 'raw', 'read', 'real', 'rear', 'rely', 'rent', 'rest', 'rib', 'rice', 'rich', 'ride', 'rift', 'rig', 'rim', 'ring', 'ripe', 'rise', 'risk', 'road', 'roar', 'robe', 'rock', 'rode', 'role', 'roll', 'roof', 'room', 'root', 'rope', 'rose', 'rot', 'rub', 'rug', 'rule', 'run', 'rung', 'runs', 'rush', 'rust', 'sack', 'safe', 'sail', 'sake', 'sale', 'salt', 'same', 'sand', 'save', 'saw', 'say', 'scan', 'scar', 'seal', 'seat', 'seed', 'seek', 'seem', 'seen', 'self', 'sell', 'send', 'sent', 'set', 'sew', 'shag', 'sham', 'shed', 'ship', 'shop', 'shot', 'show', 'shut', 'sick', 'side', 'sift', 'sigh', 'sign', 'silk', 'sill', 'sink', 'sins', 'sir', 'sit', 'size', 'skin', 'skip', 'slab', 'slam', 'slap', 'slat', 'slaw', 'slay', 'sled', 'slew', 'slid', 'slim', 'slip', 'slit', 'slog', 'slot', 'slow', 'slug', 'slum', 'slur', 'smog', 'smug', 'snag', 'snap', 'snip', 'snob', 'snot', 'snow', 'snub', 'snug', 'soak', 'soap', 'soar', 'sock', 'soda', 'sofa', 'soft', 'soil', 'sold', 'sole', 'solo', 'some', 'song', 'soon', 'sore', 'sort', 'soul', 'soup', 'sour', 'sown', 'soya', 'span', 'spar', 'spat', 'spay', 'sped', 'spew', 'spin', 'spit', 'spot', 'spun', 'spur', 'stab', 'stag', 'star', 'stay', 'stem', 'step', 'stew', 'stir', 'stop', 'stow', 'stub', 'stud', 'stun', 'suck', 'sued', 'suit', 'sulk', 'sum', 'sun', 'sunk', 'sure', 'surf', 'swab', 'swag', 'swam', 'swan', 'swap', 'swat', 'sway', 'swim', 'swum', 'tack', 'tact', 'tail', 'take', 'tale', 'talk', 'tall', 'tame', 'tank', 'tap', 'tart', 'task', 'taste', 'taut', 'tax', 'tea', 'team', 'tear', 'teas', 'teat', 'tech', 'teen', 'tees', 'tell', 'tend', 'tent', 'term', 'test', 'text', 'than', 'that', 'the', 'them', 'then', 'they', 'thick', 'thin', 'this', 'thud', 'thus', 'tick', 'tide', 'tidy', 'tied', 'tier', 'tile', 'till', 'tilt', 'time', 'tine', 'tint', 'tiny', 'tip', 'tire', 'tits', 'toad', 'toe', 'toil', 'told', 'toll', 'tomb', 'tone', 'tong', 'took', 'tool', 'toot', 'tore', 'torn', 'toss', 'tote', 'tour', 'tout', 'town', 'toy', 'toys', 'trap', 'tray', 'tree', 'trek', 'trim', 'trip', 'trod', 'trot', 'true', 'tuba', 'tube', 'tubs', 'tuck', 'tuff', 'tugs', 'tune', 'turf', 'turn', 'tusk', 'tutu', 'twig', 'twin', 'twit', 'two', 'type', 'tyre', 'ugly', 'undo', 'unit', 'unto', 'upon', 'urge', 'used', 'user', 'uses', 'vain', 'vale', 'vane', 'vary', 'vast', 'veal', 'vein', 'vent', 'verb', 'very', 'vest', 'veto', 'vice', 'view', 'vine', 'visa', 'vita', 'void', 'vole', 'volt', 'vote', 'vows', 'wade', 'wage', 'wail', 'wait', 'wake', 'walk', 'wall', 'wand', 'want', 'ward', 'ware', 'warm', 'warn', 'warp', 'wash', 'wasp', 'watt', 'wave', 'wavy', 'wax', 'ways', 'weak', 'wean', 'wear', 'weed', 'week', 'weep', 'weir', 'weld', 'well', 'went', 'wept', 'were', 'west', 'what', 'when', 'whet', 'whey', 'which', 'whig', 'while', 'whim', 'whip', 'whir', 'whit', 'who', 'why', 'wick', 'wide', 'wife', 'wigs', 'wild', 'will', 'wilt', 'wily', 'wind', 'wine', 'wing', 'wink', 'wins', 'wipe', 'wire', 'wise', 'wish', 'with', 'wits', 'woes', 'woke', 'wolf', 'womb', 'won', 'wood', 'wool', 'woos', 'word', 'wore', 'work', 'worm', 'worn', 'worry', 'worse', 'worst', 'worth', 'would', 'wound', 'wove', 'wrap', 'wren', 'writ', 'yank', 'yard', 'yarn', 'yawl', 'yawn', 'year', 'yeas', 'yell', 'yelp', 'yoga', 'yoke', 'yolk', 'yore', 'your', 'yule', 'yurt', 'zany', 'zaps', 'zeal', 'zero', 'zest', 'zinc', 'zips', 'zone', 'zoom'
    ];
    
    return commonWords.includes(word);
  }

  clearCache(): void {
    this.cache.clear();
  }
}
