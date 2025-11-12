export interface ItemSuggestion {
  item: string;
  reason: string;
  category: "complementary" | "recipe" | "seasonal" | "healthier" | "weather" | "dayOfWeek" | "exotic";
  emoji?: string;
}
const COMPLEMENTARY_ITEMS: Record<string, string[]> = {
  "tomatoes": ["avocado", "basil", "mozzarella", "olive oil", "garlic"],
  "avocado": ["tomatoes", "lime", "tortilla chips", "eggs", "bread"],
  "pasta": ["tomato sauce", "parmesan", "garlic", "olive oil", "basil"],
  "chicken": ["rice", "vegetables", "soy sauce", "garlic", "lemon"],
  "eggs": ["bacon", "cheese", "bread", "butter", "milk"],
  "bread": ["butter", "jam", "cheese", "eggs", "honey"],
  "cheese": ["crackers", "wine", "grapes", "bread", "honey"],
  "rice": ["soy sauce", "vegetables", "chicken", "sesame oil"],
  "potatoes": ["butter", "sour cream", "cheese", "bacon", "chives"],
  "lettuce": ["tomatoes", "cucumber", "dressing", "croutons", "cheese"],
  "chocolate": ["peanut butter", "caramel", "strawberries", "marshmallows"],
  "strawberries": ["cream", "chocolate", "sugar", "yogurt"],
  "coffee": ["milk", "sugar", "cream", "cinnamon"],
  "tea": ["honey", "lemon", "sugar", "milk"],
  "yogurt": ["granola", "berries", "honey", "nuts"],
};
const RECIPE_SUGGESTIONS: Record<string, { recipe: string; items: string[] }> = {
  "pasta_dish": {
    recipe: "Classic Pasta",
    items: ["pasta", "tomato sauce", "garlic", "olive oil", "parmesan", "basil"]
  },
  "breakfast": {
    recipe: "Perfect Breakfast",
    items: ["eggs", "bacon", "bread", "butter", "cheese"]
  },
  "salad": {
    recipe: "Fresh Salad",
    items: ["lettuce", "tomatoes", "cucumber", "olive oil", "lemon"]
  },
  "tacos": {
    recipe: "Taco Night",
    items: ["tortillas", "beef", "lettuce", "cheese", "salsa", "sour cream"]
  },
  "smoothie": {
    recipe: "Healthy Smoothie",
    items: ["banana", "berries", "yogurt", "honey", "milk"]
  },
  "stir_fry": {
    recipe: "Quick Stir Fry",
    items: ["rice", "vegetables", "soy sauce", "garlic", "ginger", "sesame oil"]
  },
};
const HEALTHIER_ALTERNATIVES: Record<string, string> = {
  "white bread": "whole wheat bread",
  "white rice": "brown rice",
  "soda": "sparkling water",
  "chips": "veggie chips",
  "ice cream": "frozen yogurt",
  "butter": "olive oil",
  "mayonnaise": "greek yogurt",
  "pasta": "whole wheat pasta",
  "sugar": "honey",
  "milk": "almond milk",
  "ground beef": "ground turkey",
  "sour cream": "greek yogurt",
  "bacon": "turkey bacon",
  "french fries": "sweet potato fries",
};
const EXOTIC_INGREDIENTS = [
  { name: "Dragon Fruit", emoji: "Ã°Å¸Ââ€°", description: "Vibrant pink superfood" },
  { name: "Jackfruit", emoji: "Ã°Å¸Å’Â´", description: "Tropical meat substitute" },
  { name: "Sumac", emoji: "Ã¢Å“Â¨", description: "Tangy Middle Eastern spice" },
  { name: "Gochujang", emoji: "Ã°Å¸Å’Â¶Ã¯Â¸Â", description: "Korean fermented chili paste" },
  { name: "Black Garlic", emoji: "Ã°Å¸Â§â€ž", description: "Sweet aged garlic" },
  { name: "Miso Paste", emoji: "Ã°Å¸ÂÅ“", description: "Umami-rich fermented soybean" },
  { name: "Harissa", emoji: "Ã°Å¸â€Â¥", description: "North African hot chili paste" },
  { name: "Za'atar", emoji: "Ã°Å¸Å’Â¿", description: "Mediterranean herb blend" },
  { name: "Tahini", emoji: "Ã°Å¸Â¥Å“", description: "Sesame seed butter" },
  { name: "Matcha Powder", emoji: "Ã°Å¸ÂÂµ", description: "Japanese green tea powder" },
  { name: "Truffle Oil", emoji: "Ã°Å¸Ââ€ž", description: "Luxurious aromatic oil" },
  { name: "Nutritional Yeast", emoji: "Ã¢Â­Â", description: "Cheesy vegan seasoning" },
  { name: "Kimchi", emoji: "Ã°Å¸Â¥Â¬", description: "Spicy fermented cabbage" },
  { name: "AÃƒÂ§aÃƒÂ­", emoji: "Ã°Å¸Â«Â", description: "Antioxidant-rich berry" },
  { name: "Pomegranate Molasses", emoji: "Ã°Å¸â€™Å½", description: "Sweet-tart syrup" },
];
const SEASONAL_ITEMS: Record<string, string[]> = {
  "winter": ["hot chocolate", "marshmallows", "root vegetables", "citrus fruits", "hearty soups", "cinnamon"],
  "spring": ["asparagus", "strawberries", "peas", "radishes", "fresh herbs", "lettuce"],
  "summer": ["watermelon", "corn", "tomatoes", "berries", "peaches", "zucchini"],
  "fall": ["pumpkin", "apples", "squash", "sweet potatoes", "cranberries", "brussels sprouts"],
};
const WEATHER_SUGGESTIONS: Record<string, string[]> = {
  "cold": ["hot chocolate", "soup ingredients", "tea", "comfort food", "warm spices"],
  "hot": ["ice cream", "watermelon", "lemonade", "salad ingredients", "cold drinks"],
  "rainy": ["soup mix", "comfort food", "hot beverages", "cozy snacks"],
};
const DAY_SUGGESTIONS: Record<string, string[]> = {
  "monday": ["coffee", "energy drinks", "quick meals", "meal prep ingredients"],
  "tuesday": ["taco shells", "ground beef", "salsa", "cheese", "sour cream", "lettuce"],
  "wednesday": ["midweek treats", "easy dinners", "comfort snacks"],
  "thursday": ["pre-weekend ingredients", "party snacks"],
  "friday": ["pizza ingredients", "wine", "snacks", "treats"],
  "saturday": ["brunch items", "bbq ingredients", "party food"],
  "sunday": ["meal prep containers", "bulk items", "breakfast ingredients"],
};
export const getCurrentSeason = (): string => {
  const month = new Date().getMonth();
  if (month >= 2 && month <= 4) return "spring";
  if (month >= 5 && month <= 7) return "summer";
  if (month >= 8 && month <= 10) return "fall";
  return "winter";
};
export const getCurrentDay = (): string => {
  return new Date().toLocaleDateString("en-US", { weekday: "long" }).toLowerCase();
};
export const getComplementaryItems = (item: string): ItemSuggestion[] => {
  const itemLower = item.toLowerCase().trim();
  const suggestions: ItemSuggestion[] = [];
  for (const [key, complements] of Object.entries(COMPLEMENTARY_ITEMS)) {
    if (itemLower.includes(key) || key.includes(itemLower)) {
      complements.forEach(complement => {
        suggestions.push({
          item: complement,
          reason: `Goes well with ${item}`,
          category: "complementary",
        });
      });
      break;
    }
  }
  return suggestions;
};
export const getRecipeSuggestions = (currentItems: string[]): ItemSuggestion[] => {
  const suggestions: ItemSuggestion[] = [];
  const itemsLower = currentItems.map(i => i.toLowerCase().trim());
  for (const [key, recipe] of Object.entries(RECIPE_SUGGESTIONS)) {
    const matchCount = recipe.items.filter(recipeItem =>
      itemsLower.some(item => item.includes(recipeItem) || recipeItem.includes(item))
    ).length;
    if (matchCount >= 2) {
      const missingItems = recipe.items.filter(recipeItem =>
        !itemsLower.some(item => item.includes(recipeItem) || recipeItem.includes(item))
      );
      missingItems.forEach(item => {
        suggestions.push({
          item,
          reason: `Complete your ${recipe.recipe}`,
          category: "recipe",
          emoji: "Ã°Å¸â€˜Â¨Ã¢â‚¬ÂÃ°Å¸ÂÂ³",
        });
      });
    }
  }
  return suggestions;
};
export const getHealthierAlternative = (item: string): ItemSuggestion | null => {
  const itemLower = item.toLowerCase().trim();
  for (const [unhealthy, healthy] of Object.entries(HEALTHIER_ALTERNATIVES)) {
    if (itemLower.includes(unhealthy) || unhealthy.includes(itemLower)) {
      return {
        item: healthy,
        reason: `Healthier alternative to ${item}`,
        category: "healthier",
        emoji: "Ã°Å¸â€™Å¡",
      };
    }
  }
  return null;
};
export const getSeasonalSuggestions = (): ItemSuggestion[] => {
  const season = getCurrentSeason();
  const seasonalItems = SEASONAL_ITEMS[season] || [];
  return seasonalItems.map(item => ({
    item,
    reason: `Fresh this ${season}`,
    category: "seasonal",
    emoji: season === "spring" ? "Ã°Å¸Å’Â¸" : season === "summer" ? "Ã¢Ëœâ‚¬Ã¯Â¸Â" : season === "fall" ? "Ã°Å¸Ââ€š" : "Ã¢Ââ€žÃ¯Â¸Â",
  }));
};
export const getWeatherSuggestions = (): ItemSuggestion[] => {
  const month = new Date().getMonth();
  let weatherType = "rainy";
  if (month >= 10 || month <= 1) weatherType = "cold";
  if (month >= 5 && month <= 7) weatherType = "hot";
  const weatherItems = WEATHER_SUGGESTIONS[weatherType] || [];
  const emoji = weatherType === "cold" ? "Ã°Å¸Â¥Â¶" : weatherType === "hot" ? "Ã°Å¸â€Â¥" : "Ã°Å¸Å’Â§Ã¯Â¸Â";
  return weatherItems.map(item => ({
    item,
    reason: weatherType === "cold" ? "It's cold outside!" : weatherType === "hot" ? "Perfect for hot weather" : "Rainy day comfort",
    category: "weather",
    emoji,
  }));
};
export const getDayOfWeekSuggestions = (): ItemSuggestion[] => {
  const day = getCurrentDay();
  const dayItems = DAY_SUGGESTIONS[day] || [];
  return dayItems.map(item => ({
    item,
    reason: day === "tuesday" ? "Taco Tuesday! Ã°Å¸Å’Â®" : `Perfect for ${day}`,
    category: "dayOfWeek",
    emoji: day === "tuesday" ? "Ã°Å¸Å’Â®" : "Ã°Å¸â€œâ€¦",
  }));
};
export const getExoticIngredientSuggestion = (usedItems: string[]): ItemSuggestion | null => {
  const usedItemsLower = usedItems.map(i => i.toLowerCase());
  const unusedExotic = EXOTIC_INGREDIENTS.filter(
    exotic => !usedItemsLower.some(used => used.includes(exotic.name.toLowerCase()))
  );
  if (unusedExotic.length === 0) return null;
  const randomExotic = unusedExotic[Math.floor(Math.random() * unusedExotic.length)];
  return {
    item: randomExotic.name,
    reason: `New ingredient to try! ${randomExotic.description}`,
    category: "exotic",
    emoji: randomExotic.emoji,
  };
};
export const getPatternSuggestions = (
  currentItems: string[],
  pastListsItems: string[][]
): ItemSuggestion[] => {
  const suggestions: ItemSuggestion[] = [];
  const currentItemsLower = currentItems.map(i => i.toLowerCase().trim());
  const itemPairFrequency: Record<string, Record<string, number>> = {};
  pastListsItems.forEach(list => {
    const listLower = list.map(i => i.toLowerCase().trim());
    for (let i = 0; i < listLower.length; i++) {
      for (let j = i + 1; j < listLower.length; j++) {
        const item1 = listLower[i];
        const item2 = listLower[j];
        if (!itemPairFrequency[item1]) itemPairFrequency[item1] = {};
        if (!itemPairFrequency[item2]) itemPairFrequency[item2] = {};
        itemPairFrequency[item1][item2] = (itemPairFrequency[item1][item2] || 0) + 1;
        itemPairFrequency[item2][item1] = (itemPairFrequency[item2][item1] || 0) + 1;
      }
    }
  });
  const suggestedItems = new Set<string>();
  currentItemsLower.forEach(currentItem => {
    if (itemPairFrequency[currentItem]) {
      const pairs = Object.entries(itemPairFrequency[currentItem])
        .filter(([item]) => !currentItemsLower.includes(item))
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3);
      pairs.forEach(([item, frequency]) => {
        if (frequency >= 2 && !suggestedItems.has(item)) {
          suggestedItems.add(item);
          suggestions.push({
            item,
            reason: `You usually add this with ${currentItem}`,
            category: "complementary",
            emoji: "Ã°Å¸â€œÅ ",
          });
        }
      });
    }
  });
  return suggestions;
};
export const getAllSuggestions = (
  currentItems: string[],
  pastListsItems: string[][] = []
): ItemSuggestion[] => {
  const allSuggestions: ItemSuggestion[] = [];
  allSuggestions.push(...getWeatherSuggestions().slice(0, 2));
  allSuggestions.push(...getDayOfWeekSuggestions().slice(0, 2));
  allSuggestions.push(...getSeasonalSuggestions().slice(0, 2));
  if (currentItems.length > 1) {
    allSuggestions.push(...getRecipeSuggestions(currentItems).slice(0, 3));
  }
  if (currentItems.length > 0) {
    const lastItem = currentItems[currentItems.length - 1];
    allSuggestions.push(...getComplementaryItems(lastItem).slice(0, 2));
  }
  if (pastListsItems.length > 0) {
    allSuggestions.push(...getPatternSuggestions(currentItems, pastListsItems).slice(0, 2));
  }
  const exoticSuggestion = getExoticIngredientSuggestion(currentItems);
  if (exoticSuggestion) {
    allSuggestions.push(exoticSuggestion);
  }
  const uniqueSuggestions = Array.from(
    new Map(allSuggestions.map(s => [s.item.toLowerCase(), s])).values()
  );
  return uniqueSuggestions;
};
