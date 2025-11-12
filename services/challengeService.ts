export interface Challenge {
  id: string;
  name: string;
  description: string;
  icon: string;
  emoji: string;
  color: string;
  rule: ChallengeRule;
}
export type ChallengeRule =
  | { type: 'one-color'; color: string }
  | { type: 'minimalist'; maxItems: number }
  | { type: 'maximalist'; minItems: number }
  | { type: 'speed'; timeLimit: number }
  | { type: 'alphabetical' }
  | { type: 'budget'; maxBudget: number }
  | { type: 'seasonal' }
  | { type: 'no-repeats' };
export const COLOR_CHALLENGES: Challenge[] = [
  {
    id: 'red-challenge',
    name: 'Red Foods Only',
    description: 'Create a list with only red foods (tomatoes, strawberries, etc.)',
    icon: 'palette',
    emoji: 'Ã°Å¸â€Â´',
    color: '#FF0000',
    rule: { type: 'one-color', color: 'red' }
  },
  {
    id: 'green-challenge',
    name: 'Green Foods Only',
    description: 'Create a list with only green foods (lettuce, avocado, etc.)',
    icon: 'palette',
    emoji: 'Ã°Å¸Å¸Â¢',
    color: '#4CAF50',
    rule: { type: 'one-color', color: 'green' }
  },
  {
    id: 'yellow-challenge',
    name: 'Yellow Foods Only',
    description: 'Create a list with only yellow foods (bananas, corn, etc.)',
    icon: 'palette',
    emoji: 'Ã°Å¸Å¸Â¡',
    color: '#FFD700',
    rule: { type: 'one-color', color: 'yellow' }
  },
  {
    id: 'white-challenge',
    name: 'White Foods Only',
    description: 'Create a list with only white foods (rice, milk, etc.)',
    icon: 'palette',
    emoji: 'Ã¢Å¡Âª',
    color: '#FFFFFF',
    rule: { type: 'one-color', color: 'white' }
  },
];
export const SIZE_CHALLENGES: Challenge[] = [
  {
    id: 'minimalist',
    name: 'Minimalist Challenge',
    description: 'Create a perfect list with maximum 5 items',
    icon: 'filter-5',
    emoji: 'Ã¢Å“Â¨',
    color: '#2196F3',
    rule: { type: 'minimalist', maxItems: 5 }
  },
  {
    id: 'maximalist',
    name: 'Maximalist Challenge',
    description: 'Create a mega list with 50+ items',
    icon: 'apps',
    emoji: 'Ã°Å¸â€œÂ¦',
    color: '#9C27B0',
    rule: { type: 'maximalist', minItems: 50 }
  },
];
export const SPEED_CHALLENGES: Challenge[] = [
  {
    id: 'speed-30',
    name: 'Speed List (30s)',
    description: 'Add as many items as possible in 30 seconds',
    icon: 'timer',
    emoji: 'Ã¢Å¡Â¡',
    color: '#FF6B6B',
    rule: { type: 'speed', timeLimit: 30 }
  },
  {
    id: 'speed-60',
    name: 'Speed List (60s)',
    description: 'Add as many items as possible in 60 seconds',
    icon: 'timer',
    emoji: 'Ã¢Å¡Â¡',
    color: '#FF9800',
    rule: { type: 'speed', timeLimit: 60 }
  },
];
export const CREATIVE_CHALLENGES: Challenge[] = [
  {
    id: 'alphabetical',
    name: 'A-Z Challenge',
    description: 'Create a list with one item for each letter of the alphabet',
    icon: 'abc',
    emoji: 'Ã°Å¸â€Â¤',
    color: '#4CAF50',
    rule: { type: 'alphabetical' }
  },
  {
    id: 'budget',
    name: 'Budget Challenge',
    description: 'Create a complete meal list under $20',
    icon: 'attach-money',
    emoji: 'Ã°Å¸â€™Â°',
    color: '#FF5722',
    rule: { type: 'budget', maxBudget: 20 }
  },
  {
    id: 'seasonal',
    name: 'Seasonal Challenge',
    description: 'Create a list with only seasonal produce',
    icon: 'eco',
    emoji: 'Ã°Å¸Å’Â±',
    color: '#8BC34A',
    rule: { type: 'seasonal' }
  },
  {
    id: 'no-repeats',
    name: 'No Repeats Challenge',
    description: 'Create a list without any items from your past lists',
    icon: 'new-releases',
    emoji: 'Ã°Å¸â€ â€¢',
    color: '#00BCD4',
    rule: { type: 'no-repeats' }
  },
];
export const ALL_CHALLENGES: Challenge[] = [
  ...COLOR_CHALLENGES,
  ...SIZE_CHALLENGES,
  ...SPEED_CHALLENGES,
  ...CREATIVE_CHALLENGES,
];
export const validateChallenge = (
  challenge: Challenge,
  items: string[],
  pastItems?: string[]
): { valid: boolean; message: string; progress?: number } => {
  const rule = challenge.rule;
  switch (rule.type) {
    case 'one-color':
      if (items.length === 0) {
        return { valid: false, message: 'Add at least one item!' };
      }
      return {
        valid: true,
        message: `Great! ${items.length} ${rule.color} items added!`,
        progress: items.length
      };
    case 'minimalist':
      if (items.length > rule.maxItems) {
        return {
          valid: false,
          message: `Too many items! Maximum is ${rule.maxItems}`,
          progress: items.length
        };
      }
      if (items.length === 0) {
        return { valid: false, message: 'Add at least one item!' };
      }
      return {
        valid: true,
        message: `Perfect! ${items.length} items added`,
        progress: items.length
      };
    case 'maximalist':
      if (items.length < rule.minItems) {
        return {
          valid: false,
          message: `Need ${rule.minItems - items.length} more items!`,
          progress: items.length
        };
      }
      return {
        valid: true,
        message: `Amazing! ${items.length} items - Challenge complete!`,
        progress: items.length
      };
    case 'speed':
      return {
        valid: items.length > 0,
        message: `${items.length} items in ${rule.timeLimit} seconds!`,
        progress: items.length
      };
    case 'alphabetical':
      const uniqueLetters = new Set(
        items.map(item => item.trim()[0]?.toLowerCase()).filter(Boolean)
      );
      const targetLetters = 26;
      if (uniqueLetters.size < targetLetters) {
        return {
          valid: false,
          message: `${uniqueLetters.size}/26 letters covered. Keep going!`,
          progress: uniqueLetters.size
        };
      }
      return {
        valid: true,
        message: 'All 26 letters covered!',
        progress: uniqueLetters.size
      };
    case 'budget':
      if (items.length === 0) {
        return { valid: false, message: 'Add items for your budget list!' };
      }
      return {
        valid: true,
        message: `${items.length} items added. Stay under $${rule.maxBudget}!`,
        progress: items.length
      };
    case 'seasonal':
      if (items.length === 0) {
        return { valid: false, message: 'Add seasonal items!' };
      }
      return {
        valid: true,
        message: `${items.length} seasonal items added!`,
        progress: items.length
      };
    case 'no-repeats':
      if (!pastItems || pastItems.length === 0) {
        return {
          valid: true,
          message: `${items.length} new items!`,
          progress: items.length
        };
      }
      const pastItemsLower = pastItems.map(i => i.toLowerCase().trim());
      const repeatedItems = items.filter(item =>
        pastItemsLower.includes(item.toLowerCase().trim())
      );
      if (repeatedItems.length > 0) {
        return {
          valid: false,
          message: `Found ${repeatedItems.length} repeated items: ${repeatedItems.slice(0, 3).join(', ')}`,
          progress: items.length - repeatedItems.length
        };
      }
      return {
        valid: true,
        message: `Perfect! All ${items.length} items are new!`,
        progress: items.length
      };
    default:
      return { valid: false, message: 'Unknown challenge type' };
  }
};
export const suggestChallenges = (itemCount: number): Challenge[] => {
  const suggestions: Challenge[] = [];
  if (itemCount <= 5) {
    suggestions.push(SIZE_CHALLENGES[0]);
  }
  if (itemCount >= 15) {
    suggestions.push(SIZE_CHALLENGES[1]);
  }
  const randomColorChallenge = COLOR_CHALLENGES[Math.floor(Math.random() * COLOR_CHALLENGES.length)];
  suggestions.push(randomColorChallenge);
  const randomCreativeChallenge = CREATIVE_CHALLENGES[Math.floor(Math.random() * CREATIVE_CHALLENGES.length)];
  suggestions.push(randomCreativeChallenge);
  return suggestions.slice(0, 2);
};
