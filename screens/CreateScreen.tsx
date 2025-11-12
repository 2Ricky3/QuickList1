import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
  Animated,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import { auth } from "../firebaseConfig";
import { v4 as uuidv4 } from "uuid";
import "react-native-get-random-values";
import {
  globalStyles,
  colors,
  createScreenStyles,
  spacing,
  borderRadius,
  elevation,
  typography,
  getTagColor
} from "../GlobalStyleSheet";
import { createList, fetchUserLists } from "../services/listService";
import { updateUserStats, getEncouragingMessage } from "../services/achievementService";
import { SwipeableInput } from "../components/SwipeableInput";
import { AnimatedPressable } from "../components/AnimatedPressable";
import { FAB } from "../components/FAB";
import { ConfettiCelebration } from "../components/ConfettiCelebration";
import { Toast } from "../components/Toast";
import { useToast } from "../hooks/useToast";
import { LinearGradient } from "expo-linear-gradient";
import { logFirestoreError } from "../services/errorLogger";
import {
  validateListName,
  validateItemsArray,
  validateTagsArray,
  sanitizeString
} from "../utils/validation";
import * as Haptics from "expo-haptics";
import {
  getAllSuggestions,
  getWeatherSuggestions,
  getDayOfWeekSuggestions,
  getSeasonalSuggestions,
  getExoticIngredientSuggestion,
  ItemSuggestion
} from "../services/suggestionService";
import {
  ALL_CHALLENGES,
  validateChallenge,
  Challenge
} from "../services/challengeService";
const PREDEFINED_TAGS = [
  "Groceries",
  "Weekly",
  "Monthly",
  "Sales",
  "Snacks",
  "Beverages",
  "Cleaning",
  "Essentials",
  "Party",
  "Health",
  "Organic",
  "Bulk Buy",
  "Quick Trip",
  "Meal Prep",
  "Breakfast",
  "Lunch",
  "Dinner",
  "Dessert",
  "Fruits",
  "Vegetables",
];
const RANDOM_ITEMS = [
  "Chocolate Bar",
  "Ice Cream",
  "Energy Drink",
  "Water",
  "Fancy Cheese",
  "Mystery Snack",
  "Surprise Fruit",
  "Gourmet Cookie",
  "Exotic Juice",
  "Special Treat",
];
const THEMED_ITEMS = {
  "Recipe Roulette": [
    "Pasta", "Tomato Sauce", "Garlic", "Olive Oil", "Parmesan", "Fresh Basil",
    "Chicken Breast", "Bell Peppers", "Onions", "Rice", "Soy Sauce", "Ginger"
  ],
  "Healthy Challenge": [
    "Kale", "Quinoa", "Avocado", "Almonds", "Greek Yogurt", "Blueberries",
    "Salmon", "Sweet Potato", "Spinach", "Chia Seeds", "Green Tea", "Hummus"
  ],
  "International Night": [
    "Sushi Rice", "Nori Sheets", "Wasabi", "Soy Sauce", "Tacos Shells", "Salsa",
    "Curry Paste", "Coconut Milk", "Pita Bread", "Feta Cheese", "Basmati Rice", "Cumin"
  ],
  "Comfort Food": [
    "Mac & Cheese", "Mashed Potatoes", "Chicken Noodle Soup", "Pizza Dough", "Hot Chocolate",
    "Cookies", "Ice Cream", "Grilled Cheese Ingredients", "Popcorn", "Brownies Mix"
  ],
  "Adventure Mode": [
    "Dragon Fruit", "Jackfruit", "Kimchi", "Matcha Powder", "Truffle Oil", "Edamame",
    "Kombucha", "Seaweed Snacks", "Miso Paste", "Star Fruit", "AÃƒÂ§aÃƒÂ­", "Tahini"
  ],
  "Picnic Party Ã°Å¸Â§Âº": [
    "Sandwiches", "Fresh Fruit", "Cheese & Crackers", "Lemonade", "Potato Salad",
    "Watermelon", "Chips", "Cookies", "Grapes", "Hummus", "Pita Chips", "Pasta Salad"
  ],
  "Dessert Decadence Ã°Å¸ÂÂ°": [
    "Chocolate Chips", "Heavy Cream", "Vanilla Extract", "Butter", "Sugar", "Eggs",
    "Flour", "Cocoa Powder", "Sprinkles", "Ice Cream", "Caramel Sauce", "Whipped Cream"
  ],
  "Breakfast Bonanza Ã°Å¸ÂÂ³": [
    "Eggs", "Bacon", "Pancake Mix", "Maple Syrup", "Fresh Berries", "Orange Juice",
    "Yogurt", "Granola", "Coffee", "Bagels", "Cream Cheese", "Avocado Toast"
  ],
  "Kitchen Experiments Ã°Å¸Â§Âª": [
    "Liquid Smoke", "Saffron", "Nutritional Yeast", "Gochujang", "Fish Sauce", "Mirin",
    "Harissa", "Tahini", "Black Garlic", "Sumac", "Za'atar", "Cardamom"
  ],
  "Italian Journey Ã°Å¸â€¡Â®Ã°Å¸â€¡Â¹": [
    "Fresh Mozzarella", "San Marzano Tomatoes", "Arborio Rice", "Proscuitto", "Balsamic Vinegar",
    "Parmigiano Reggiano", "Fresh Basil", "Pine Nuts", "Pancetta", "Mascarpone", "Espresso", "Olive Oil"
  ],
  "Mexican Fiesta Ã°Å¸â€¡Â²Ã°Å¸â€¡Â½": [
    "Corn Tortillas", "Black Beans", "JalapeÃƒÂ±os", "Cilantro", "Lime", "Cotija Cheese",
    "Avocados", "Salsa Verde", "Chipotle Peppers", "Queso Fresco", "Mexican Crema", "Chorizo"
  ],
  "Asian Fusion Ã°Å¸Â¥Â¢": [
    "Rice Noodles", "Bok Choy", "Sesame Oil", "Rice Vinegar", "Sriracha", "Hoisin Sauce",
    "Bamboo Shoots", "Water Chestnuts", "Thai Basil", "Fish Sauce", "Lemongrass", "Ginger"
  ],
  "Mediterranean Magic Ã°Å¸Ââ€“Ã¯Â¸Â": [
    "Feta Cheese", "Kalamata Olives", "Tzatziki", "Pita Bread", "Hummus", "Cucumber",
    "Cherry Tomatoes", "Red Onion", "Oregano", "Lemon", "Chickpeas", "Tahini"
  ],
  "Spring Fresh Ã°Å¸Å’Â¸": [
    "Asparagus", "Peas", "Strawberries", "Radishes", "Spring Lettuce", "Fresh Herbs",
    "Baby Carrots", "Artichokes", "Green Beans", "Mint", "Lemon", "New Potatoes"
  ],
  "Summer BBQ Ã¢Ëœâ‚¬Ã¯Â¸Â": [
    "Hamburger Buns", "Ground Beef", "Hot Dogs", "BBQ Sauce", "Corn on the Cob", "Watermelon",
    "Coleslaw Mix", "Baked Beans", "Pickles", "Potato Chips", "Ketchup", "Mustard"
  ],
  "Fall Harvest Ã°Å¸Ââ€š": [
    "Pumpkin", "Sweet Potatoes", "Brussels Sprouts", "Butternut Squash", "Apples", "Cinnamon",
    "Cranberries", "Pecans", "Maple Syrup", "Pears", "Sage", "Nutmeg"
  ],
  "Winter Warmth Ã¢Ââ€žÃ¯Â¸Â": [
    "Hot Chocolate", "Marshmallows", "Beef Stew Meat", "Root Vegetables", "Hearty Bread",
    "Chicken Broth", "Ginger", "Cinnamon Sticks", "Oatmeal", "Honey", "Tea", "Soup Mix"
  ],
  "Taco Tuesday Ã°Å¸Å’Â®": [
    "Taco Shells", "Ground Beef", "Lettuce", "Tomatoes", "Cheese", "Sour Cream",
    "Salsa", "Guacamole", "JalapeÃƒÂ±os", "Taco Seasoning", "Cilantro", "Lime"
  ]
};
const COLOR_OPTIONS = [
  { id: 1, type: 'solid', color: "#C20200", name: "Classic Red" },
  { id: 2, type: 'solid', color: "#FFD700", name: "Golden Yellow" },
  { id: 3, type: 'solid', color: "#FF6347", name: "Tomato" },
  { id: 4, type: 'solid', color: "#4CAF50", name: "Fresh Green" },
  { id: 5, type: 'solid', color: "#2196F3", name: "Sky Blue" },
  { id: 6, type: 'solid', color: "#9C27B0", name: "Purple" },
  { id: 7, type: 'solid', color: "#FF9800", name: "Orange" },
  { id: 8, type: 'solid', color: "#E91E63", name: "Pink" },
  { id: 9, type: 'solid', color: "#00BCD4", name: "Cyan" },
  { id: 10, type: 'solid', color: "#8BC34A", name: "Lime" },
  { id: 11, type: 'solid', color: "#FF5722", name: "Deep Orange" },
  { id: 12, type: 'solid', color: "#673AB7", name: "Deep Purple" },
  { id: 13, type: 'gradient', colors: ["#FF6B6B", "#FFE66D"], name: "Sunset" },
  { id: 14, type: 'gradient', colors: ["#4ECDC4", "#44A08D"], name: "Ocean" },
  { id: 15, type: 'gradient', colors: ["#A8E6CF", "#3DDC84"], name: "Forest" },
  { id: 16, type: 'gradient', colors: ["#FF8C94", "#FFAAA5"], name: "Cotton Candy" },
  { id: 17, type: 'gradient', colors: ["#C471ED", "#F64F59"], name: "Neon Dreams" },
  { id: 18, type: 'gradient', colors: ["#FAD961", "#F76B1C"], name: "Warm Glow" },
  { id: 19, type: 'gradient', colors: ["#A1C4FD", "#C2E9FB"], name: "Sky" },
  { id: 20, type: 'gradient', colors: ["#FFA8A8", "#FCFF82"], name: "Spring" },
  { id: 21, type: 'gradient', colors: ["#667EEA", "#764BA2"], name: "Purple Haze" },
  { id: 22, type: 'gradient', colors: ["#F093FB", "#F5576C"], name: "Berry Blast" },
];
const CreateScreen = () => {
  const [listTitle, setListTitle] = useState("");
  const [items, setItems] = useState([""]);
  const [tags, setTags] = useState<string[]>([]);
  const [listColor, setListColor] = useState(COLOR_OPTIONS[0]);
  const [saving, setSaving] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [smartSuggestions, setSmartSuggestions] = useState<ItemSuggestion[]>([]);
  const [showSmartSuggestions, setShowSmartSuggestions] = useState(false);
  const [activeChallenge, setActiveChallenge] = useState<Challenge | null>(null);
  const [challengeProgress, setChallengeProgress] = useState<string>("");
  const [speedTimer, setSpeedTimer] = useState<number | null>(null);
  const [speedTimerActive, setSpeedTimerActive] = useState(false);
  const [pastListsItems, setPastListsItems] = useState<string[][]>([]);
  const [showThemePicker, setShowThemePicker] = useState(false);
  const [showAllTags, setShowAllTags] = useState(false);
  const navigation = useNavigation();
  const { toast, showToast, hideToast } = useToast();
  const fabBottom = useRef(new Animated.Value(20)).current;
  const headerAnim = useRef(new Animated.Value(0)).current;
  const colorPickerAnim = useRef(new Animated.Value(0)).current;
  const itemsAnim = useRef(new Animated.Value(0)).current;
  const tagsAnim = useRef(new Animated.Value(0)).current;
  const buttonsAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.stagger(80, [
      Animated.spring(headerAnim, {
        toValue: 1,
        tension: 300,
        friction: 20,
        useNativeDriver: true,
      }),
      Animated.spring(colorPickerAnim, {
        toValue: 1,
        tension: 300,
        friction: 20,
        useNativeDriver: true,
      }),
      Animated.spring(itemsAnim, {
        toValue: 1,
        tension: 300,
        friction: 20,
        useNativeDriver: true,
      }),
      Animated.spring(tagsAnim, {
        toValue: 1,
        tension: 300,
        friction: 20,
        useNativeDriver: true,
      }),
      Animated.spring(buttonsAnim, {
        toValue: 1,
        tension: 300,
        friction: 20,
        useNativeDriver: true,
      }),
    ]).start();
    loadPastLists();
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      (e) => {
        Animated.timing(fabBottom, {
          toValue: e.endCoordinates.height + 10,
          duration: 250,
          useNativeDriver: false,
        }).start();
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        Animated.timing(fabBottom, {
          toValue: 20,
          duration: 250,
          useNativeDriver: false,
        }).start();
      }
    );
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);
  const loadPastLists = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;
      const lists = await fetchUserLists(user.uid, 20);
      const allItems = lists.map(list => list.items || []);
      setPastListsItems(allItems);
    } catch (error) {
      logFirestoreError(error, 'Load past lists', 'lists');
    }
  };
  useEffect(() => {
    const currentItems = items.filter(i => i.trim() !== "");
    if (currentItems.length > 0) {
      const suggestions = getAllSuggestions(currentItems, pastListsItems);
      setSmartSuggestions(suggestions.slice(0, 8));
    } else {
      const weatherSuggestions = getWeatherSuggestions().slice(0, 2);
      const dayOfWeekSuggestions = getDayOfWeekSuggestions().slice(0, 2);
      const seasonalSuggestions = getSeasonalSuggestions().slice(0, 2);
      setSmartSuggestions([...weatherSuggestions, ...dayOfWeekSuggestions, ...seasonalSuggestions].slice(0, 6));
    }
  }, [items, pastListsItems]);
  useEffect(() => {
    if (activeChallenge) {
      const currentItems = items.filter(i => i.trim() !== "");
      const allPastItems = pastListsItems.flat();
      const validation = validateChallenge(activeChallenge, currentItems, allPastItems);
      setChallengeProgress(validation.message);
    }
  }, [items, activeChallenge]);
  const serializeColor = (colorOption: typeof COLOR_OPTIONS[0]) => {
    return JSON.stringify(colorOption);
  };
  const toggleTag = (tag: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (tags.includes(tag)) {
      setTags(tags.filter(t => t !== tag));
    } else {
      setTags([...tags, tag]);
    }
  };
  const handleColorSelect = (colorOption: typeof COLOR_OPTIONS[0]) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setListColor(colorOption);
    showToast(`Color changed to ${colorOption.name}`, "info");
  };
  const handleAddItem = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setItems([...items, ""]);
  };
  const handleItemChange = (text: string, index: number) => {
    const updated = [...items];
    updated[index] = text;
    setItems(updated);
  };
  const handleDeleteItem = (index: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const updated = [...items];
    updated.splice(index, 1);
    setItems(updated);
  };
  const handleSaveList = async () => {
    const sanitizedTitle = sanitizeString(listTitle.trim());
    const sanitizedItems = items
      .map(item => sanitizeString(item))
      .filter(item => item.length > 0);
    const titleValidation = validateListName(sanitizedTitle);
    if (!titleValidation.isValid) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Invalid List Name", titleValidation.error);
      return;
    }
    const itemsValidation = validateItemsArray(sanitizedItems);
    if (!itemsValidation.isValid) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Invalid Items", itemsValidation.error);
      return;
    }
    if (tags.length > 0) {
      const tagsValidation = validateTagsArray(tags);
      if (!tagsValidation.isValid) {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        Alert.alert("Invalid Tags", tagsValidation.error);
        return;
      }
    }
    setSaving(true);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      const user = auth.currentUser;
      if (!user) return;
      const tagsArray = tags;
      const filteredItems = items.filter((i) => i.trim() !== "");
      await createList({
        uid: user.uid,
        title: listTitle,
        items: filteredItems,
        tags: tagsArray,
        color: serializeColor(listColor),
        shareId: uuidv4(),
        allowPublicEdit: false,
      });
      const emojiRegex = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1F1E0}-\u{1F1FF}]/gu;
      const emojiCount = filteredItems.reduce((count, item) => {
        const matches = item.match(emojiRegex);
        return count + (matches ? matches.length : 0);
      }, 0);
      const genericNames = ["list", "shopping", "groceries", "items", "things"];
      const isCreativeName = !genericNames.some(generic =>
        listTitle.toLowerCase().includes(generic)
      ) && listTitle.length > 5;
      const isThemedList = activeChallenge !== null;
      const themesUsedInList: string[] = [];
      Object.entries(THEMED_ITEMS).forEach(([themeName, themeItems]) => {
        const matchCount = filteredItems.filter(item =>
          themeItems.some(themeItem =>
            item.toLowerCase().includes(themeItem.toLowerCase()) ||
            themeItem.toLowerCase().includes(item.toLowerCase())
          )
        ).length;
        if (matchCount >= 2) {
          themesUsedInList.push(themeName);
        }
      });
      const achievements = await updateUserStats(user.uid, {
        listsCreated: 1,
        newTags: tagsArray,
        newColor: serializeColor(listColor),
        newItems: filteredItems,
        emojisAdded: emojiCount,
        creativeName: isCreativeName,
        themedListCompleted: isThemedList,
        themesUsed: themesUsedInList,
        challengeCompleted: activeChallenge !== null,
      });
      const newlyUnlocked = achievements.filter(a => a.unlocked && a.progress === a.target);
      if (newlyUnlocked.length > 0) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3500);
        const achievementTitles = newlyUnlocked.map(a => a.title).join(", ");
        setTimeout(() => {
          Alert.alert(
            "Ã°Å¸Å½â€° Achievement Unlocked!",
            `${achievementTitles}\n\n${getEncouragingMessage(achievements)}`,
            [{ text: "Awesome!", style: "default" }]
          );
        }, 500);
      }
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert("Success", "List created!" + (newlyUnlocked.length > 0 ? " Ã°Å¸Å½â€°" : ""));
      navigation.goBack();
    } catch (error) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      logFirestoreError(error, 'Save list', 'lists');
      Alert.alert("Error", "Could not save list. Please try again.");
    } finally {
      setSaving(false);
    }
  };
  const handleSurpriseMe = () => {
    setShowThemePicker(!showThemePicker);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };
  const handleSelectTheme = (theme: keyof typeof THEMED_ITEMS) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    const themeItems = THEMED_ITEMS[theme];
    const available = themeItems.filter(
      (item) => !items.some((i) => i.trim().toLowerCase() === item.toLowerCase())
    );
    if (available.length === 0) {
      showToast("All items from this theme are already added!", "warning");
      return;
    }
    const randomItems = [];
    for (let i = 0; i < Math.min(3, available.length); i++) {
      const randomIndex = Math.floor(Math.random() * available.length);
      randomItems.push(available.splice(randomIndex, 1)[0]);
    }
    setItems([...items, ...randomItems]);
    setShowThemePicker(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    showToast(`Added ${randomItems.length} themed items! Ã°Å¸Å½â€°`, "success");
    if (auth.currentUser) {
      updateUserStats(auth.currentUser.uid, { surprisesUsed: 1 });
    }
  };
  const handleRandomSurprise = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    const available = RANDOM_ITEMS.filter(
      (item) => !items.some((i) => i.trim().toLowerCase() === item.toLowerCase())
    );
    if (available.length === 0) {
      Alert.alert("All surprises already added!");
      return;
    }
    const randomItem = available[Math.floor(Math.random() * available.length)];
    setItems([...items, randomItem]);
    setShowThemePicker(false);
    if (auth.currentUser) {
      updateUserStats(auth.currentUser.uid, { surprisesUsed: 1 });
    }
  };
  const handleStartChallenge = () => {
    Alert.alert(
      "Choose a Challenge Ã°Å¸Ââ€ ",
      "Select a creative challenge to try:",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Color Challenges Ã°Å¸Å½Â¨",
          onPress: () => showChallengeOptions('color')
        },
        {
          text: "Size Challenges Ã°Å¸â€œÂ",
          onPress: () => showChallengeOptions('size')
        },
        {
          text: "Speed Challenges Ã¢Å¡Â¡",
          onPress: () => showChallengeOptions('speed')
        },
        {
          text: "Creative Challenges Ã°Å¸Å’Å¸",
          onPress: () => showChallengeOptions('creative')
        },
      ]
    );
  };
  const showChallengeOptions = (type: string) => {
    let challenges: Challenge[] = [];
    switch (type) {
      case 'color':
        challenges = ALL_CHALLENGES.filter(c => c.id.includes('color') || c.id.includes('red') || c.id.includes('green') || c.id.includes('yellow') || c.id.includes('white'));
        break;
      case 'size':
        challenges = ALL_CHALLENGES.filter(c => c.id.includes('minimalist') || c.id.includes('maximalist'));
        break;
      case 'speed':
        challenges = ALL_CHALLENGES.filter(c => c.id.includes('speed'));
        break;
      case 'creative':
        challenges = ALL_CHALLENGES.filter(c => c.id.includes('alphabetical') || c.id.includes('budget') || c.id.includes('seasonal') || c.id.includes('no-repeats'));
        break;
    }
    Alert.alert(
      "Select Challenge",
      "Choose your challenge:",
      [
        { text: "Cancel", style: "cancel" },
        ...challenges.map(challenge => ({
          text: `${challenge.emoji} ${challenge.name}`,
          onPress: () => activateChallenge(challenge)
        }))
      ]
    );
  };
  const activateChallenge = (challenge: Challenge) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setActiveChallenge(challenge);
    setChallengeProgress(`Challenge Active: ${challenge.description}`);
    if (challenge.rule.type === 'speed') {
      startSpeedChallenge(challenge.rule.timeLimit);
    }
    Alert.alert(
      `${challenge.emoji} Challenge Started!`,
      challenge.description,
      [{ text: "Let's Go!", style: "default" }]
    );
  };
  const startSpeedChallenge = (timeLimit: number) => {
    setSpeedTimer(timeLimit);
    setSpeedTimerActive(true);
    const interval = setInterval(() => {
      setSpeedTimer(prev => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          setSpeedTimerActive(false);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          Alert.alert("Time's Up!", `You added ${items.filter(i => i.trim()).length} items!`);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };
  const handleAddSmartSuggestion = (suggestion: ItemSuggestion) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const emptyIndex = items.findIndex(item => item.trim() === "");
    if (emptyIndex !== -1) {
      const updated = [...items];
      updated[emptyIndex] = suggestion.item;
      setItems(updated);
    } else {
      setItems([...items, suggestion.item]);
    }
    showToast(`Added "${suggestion.item}" Ã¢Å“â€œ`, "success");
    setSmartSuggestions(smartSuggestions.filter(s => s.item !== suggestion.item));
  };
  const handleExoticIngredient = () => {
    const currentItems = items.filter(i => i.trim() !== "");
    const allPastItems = pastListsItems.flat();
    const allUsedItems = [...currentItems, ...allPastItems];
    const exotic = getExoticIngredientSuggestion(allUsedItems);
    if (exotic) {
      Alert.alert(
        `${exotic.emoji} Try Something New!`,
        `${exotic.item}\n\n${exotic.reason}`,
        [
          { text: "Maybe Later", style: "cancel" },
          {
            text: "Add It!",
            style: "default",
            onPress: () => {
              setItems([...items, exotic.item]);
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            }
          }
        ]
      );
    } else {
      Alert.alert("Wow!", "You've tried all our exotic ingredients! Ã°Å¸Å½â€°");
    }
  };
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <View style={{ flex: 1, backgroundColor: colors.backgroundLight }}>
        <Toast
          message={toast.message}
          type={toast.type}
          visible={toast.visible}
          onHide={hideToast}
          duration={2000}
        />
        <ConfettiCelebration show={showConfetti} />
        <ScrollView
          contentContainerStyle={[globalStyles.scrollContentWithBottomBar, { paddingBottom: 100 }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Animated.View style={{
            backgroundColor: colors.white,
            borderRadius: borderRadius.lg,
            padding: spacing.xl,
            marginBottom: spacing.xl,
            ...elevation.md,
            opacity: headerAnim,
            transform: [{
              translateY: headerAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0],
              }),
            }],
          }}>
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: spacing.xs }}>
              <MaterialIcons name="shopping-cart" size={32} color={colors.primary} />
              <Text style={[typography.h1, { marginBottom: 0, marginLeft: spacing.md, flex: 1, color: colors.textDark, fontSize: 24 }]}>
                New Shopping List
              </Text>
            </View>
            <Text style={{ color: colors.textMedium, fontSize: 14, marginLeft: 40 }}>
              Add your items below
            </Text>
          </Animated.View>
          <View style={{ marginBottom: spacing.md }}>
            <Text style={{
              fontSize: 11,
              fontWeight: "700",
              textTransform: "uppercase",
              color: colors.textMedium,
              letterSpacing: 1,
              marginBottom: spacing.sm,
              marginLeft: spacing.xs,
            }}>
              Essential Information
            </Text>
          </View>
          <Animated.View style={{
            backgroundColor: colors.white,
            borderRadius: borderRadius.lg,
            padding: spacing.lg,
            marginBottom: spacing.md,
            ...elevation.sm,
            opacity: headerAnim,
          }}>
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: spacing.sm }}>
              <MaterialIcons name="edit" size={20} color={colors.primary} />
              <Text style={{ fontSize: 15, fontWeight: "700", color: colors.textDark, marginLeft: spacing.sm }}>
                List Name
              </Text>
              <View style={{
                marginLeft: spacing.sm,
                paddingHorizontal: spacing.xs,
                paddingVertical: 2,
                backgroundColor: `${colors.danger}15`,
                borderRadius: 4,
              }}>
                <Text style={{ fontSize: 10, fontWeight: "700", color: colors.danger }}>REQUIRED</Text>
              </View>
            </View>
            <TextInput
              style={[
                globalStyles.inputField,
                { marginBottom: 0 },
                focusedInput === 'title' && globalStyles.inputFieldFocused
              ]}
              placeholder="e.g., Weekly Groceries, Party Shopping..."
              placeholderTextColor={colors.textLight}
              value={listTitle}
              onChangeText={setListTitle}
              onFocus={() => setFocusedInput('title')}
              onBlur={() => setFocusedInput(null)}
              returnKeyType="done"
            />
          </Animated.View>
          <Animated.View style={{
            backgroundColor: colors.white,
            borderRadius: borderRadius.lg,
            padding: spacing.lg,
            marginBottom: spacing.xl,
            ...elevation.sm,
            opacity: itemsAnim,
            transform: [{
              translateY: itemsAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0],
              }),
            }],
          }}>
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: spacing.md }}>
              <MaterialIcons name="list" size={20} color={colors.primary} />
              <Text style={{ fontSize: 15, fontWeight: "700", color: colors.textDark, marginLeft: spacing.sm }}>
                Shopping Items
              </Text>
              <View style={{
                marginLeft: spacing.sm,
                paddingHorizontal: spacing.xs,
                paddingVertical: 2,
                backgroundColor: `${colors.danger}15`,
                borderRadius: 4,
              }}>
                <Text style={{ fontSize: 10, fontWeight: "700", color: colors.danger }}>REQUIRED</Text>
              </View>
            </View>
            {items.map((item, index) => (
              <SwipeableInput
                key={index}
                value={item}
                onChangeText={(text) => handleItemChange(text, index)}
                onDelete={() => handleDeleteItem(index)}
                isFocused={focusedInput === `item-${index}`}
                onFocus={() => setFocusedInput(`item-${index}`)}
                onBlur={() => setFocusedInput(null)}
                placeholder={`Item ${index + 1}`}
                placeholderTextColor={colors.textLight}
                returnKeyType="done"
              />
            ))}
            <AnimatedPressable
              style={[
                globalStyles.buttonContainer,
                {
                  marginTop: spacing.md,
                  backgroundColor: colors.primary,
                }
              ]}
              onPress={handleAddItem}
            >
              <MaterialIcons name="add-circle" size={22} color={colors.white} style={{ marginRight: spacing.sm }} />
              <Text style={{ color: colors.white, fontSize: 16, fontWeight: "600" }}>Add Another Item</Text>
            </AnimatedPressable>
          </Animated.View>
          <View style={{ marginBottom: spacing.md }}>
            <Text style={{
              fontSize: 11,
              fontWeight: "700",
              textTransform: "uppercase",
              color: colors.textMedium,
              letterSpacing: 1,
              marginLeft: spacing.xs,
            }}>
              Optional Customization
            </Text>
          </View>
          <Animated.View style={{
            backgroundColor: colors.white,
            borderRadius: borderRadius.lg,
            padding: spacing.lg,
            marginBottom: spacing.md,
            ...elevation.sm,
            opacity: tagsAnim,
            transform: [{
              translateY: tagsAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0],
              }),
            }],
          }}>
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: spacing.sm }}>
              <MaterialIcons name="label-outline" size={20} color={colors.textMedium} />
              <Text style={{ fontSize: 15, fontWeight: "600", color: colors.textDark, marginLeft: spacing.sm, flex: 1 }}>
                Tags
              </Text>
              <View style={{
                paddingHorizontal: spacing.xs,
                paddingVertical: 2,
                backgroundColor: colors.backgroundLight,
                borderRadius: 4,
              }}>
                <Text style={{ fontSize: 10, fontWeight: "600", color: colors.textMedium }}>OPTIONAL</Text>
              </View>
            </View>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.xs, marginBottom: spacing.sm }}>
              {PREDEFINED_TAGS.slice(0, showAllTags ? PREDEFINED_TAGS.length : 8).map((tag) => {
                const isSelected = tags.includes(tag);
                const tagColor = getTagColor(tag);
                return (
                  <AnimatedPressable
                    key={tag}
                    onPress={() => toggleTag(tag)}
                    style={{
                      paddingHorizontal: spacing.md,
                      paddingVertical: spacing.sm,
                      borderRadius: borderRadius.round,
                      backgroundColor: isSelected ? tagColor.bg : colors.backgroundLight,
                      borderWidth: 1.5,
                      borderColor: isSelected ? tagColor.border : colors.border,
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    {isSelected && (
                      <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: tagColor.border }} />
                    )}
                    <Text style={{
                      fontSize: 13,
                      fontWeight: isSelected ? "700" : "500",
                      color: isSelected ? tagColor.text : colors.textMedium
                    }}>
                      {tag}
                    </Text>
                  </AnimatedPressable>
                );
              })}
            </View>
            {PREDEFINED_TAGS.length > 8 && (
              <Pressable
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setShowAllTags(!showAllTags);
                }}
                style={{
                  paddingVertical: spacing.sm,
                  alignItems: "center",
                  flexDirection: "row",
                  justifyContent: "center",
                  gap: spacing.xs,
                }}
              >
                <Text style={{ fontSize: 12, fontWeight: "600", color: colors.primary }}>
                  {showAllTags ? "Show Less" : `See ${PREDEFINED_TAGS.length - 8} More Options`}
                </Text>
                <MaterialIcons
                  name={showAllTags ? "expand-less" : "expand-more"}
                  size={20}
                  color={colors.primary}
                />
              </Pressable>
            )}
            {tags.length > 0 && (
              <View style={{ marginTop: spacing.md, paddingTop: spacing.md, borderTopWidth: 1, borderTopColor: colors.border }}>
                <Text style={{ fontSize: 11, color: colors.textMedium, marginBottom: spacing.xs, fontWeight: '600' }}>
                  Selected ({tags.length}):
                </Text>
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.xs }}>
                  {tags.map((tag, index) => {
                    const tagColor = getTagColor(tag);
                    return (
                      <View
                        key={index}
                        style={{
                          paddingHorizontal: spacing.sm,
                          paddingVertical: spacing.xs,
                          borderRadius: borderRadius.sm,
                          backgroundColor: tagColor.bg,
                          borderWidth: 1,
                          borderColor: tagColor.border,
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: tagColor.border }} />
                        <Text style={{ fontSize: 11, fontWeight: "600", color: tagColor.text }}>
                          {tag}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            )}
          </Animated.View>
          <Animated.View style={{
            backgroundColor: colors.white,
            borderRadius: borderRadius.lg,
            padding: spacing.lg,
            marginBottom: spacing.xl,
            ...elevation.sm,
            opacity: colorPickerAnim,
            transform: [{
              translateY: colorPickerAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0],
              }),
            }],
          }}>
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: spacing.md }}>
              <MaterialIcons name="palette" size={20} color={colors.textMedium} />
              <Text style={{ fontSize: 15, fontWeight: "600", color: colors.textDark, marginLeft: spacing.sm, flex: 1 }}>
                List Color
              </Text>
              <View style={{
                paddingHorizontal: spacing.xs,
                paddingVertical: 2,
                backgroundColor: colors.backgroundLight,
                borderRadius: 4,
              }}>
                <Text style={{ fontSize: 10, fontWeight: "600", color: colors.textMedium }}>OPTIONAL</Text>
              </View>
            </View>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: spacing.md,
              backgroundColor: colors.backgroundLight,
              borderRadius: borderRadius.md,
              marginBottom: spacing.md,
            }}>
              <View style={{
                width: 40,
                height: 40,
                borderRadius: borderRadius.md,
                overflow: 'hidden',
                marginRight: spacing.md,
                borderWidth: 2,
                borderColor: colors.border,
              }}>
                {listColor.type === 'solid' ? (
                  <View style={{ flex: 1, backgroundColor: listColor.color }} />
                ) : (
                  <LinearGradient
                    colors={listColor.colors! as [string, string, ...string[]]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{ flex: 1 }}
                  />
                )}
              </View>
              <Text style={{ fontSize: 15, fontWeight: "600", color: colors.textDark }}>
                {listColor.name}
              </Text>
            </View>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.sm }}>
              {COLOR_OPTIONS.map((colorOption) => {
                const isSelected = listColor.id === colorOption.id;
                return colorOption.type === 'solid' ? (
                  <AnimatedPressable
                    key={colorOption.id}
                    onPress={() => handleColorSelect(colorOption)}
                    scaleValue={0.9}
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: borderRadius.md,
                      backgroundColor: colorOption.color,
                      borderWidth: isSelected ? 3 : 2,
                      borderColor: isSelected ? colors.textDark : colors.border,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {isSelected && <MaterialIcons name="check" size={24} color={colors.white} />}
                  </AnimatedPressable>
                ) : (
                  <AnimatedPressable
                    key={colorOption.id}
                    onPress={() => handleColorSelect(colorOption)}
                    scaleValue={0.9}
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: borderRadius.md,
                      overflow: "hidden",
                      borderWidth: isSelected ? 3 : 2,
                      borderColor: isSelected ? colors.textDark : colors.border,
                    }}
                  >
                    <LinearGradient
                      colors={colorOption.colors! as [string, string, ...string[]]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
                    >
                      {isSelected && <MaterialIcons name="check" size={24} color={colors.white} />}
                    </LinearGradient>
                  </AnimatedPressable>
                );
              })}
            </View>
          </Animated.View>
          <View style={{ marginBottom: spacing.md }}>
            <Text style={{
              fontSize: 11,
              fontWeight: "700",
              textTransform: "uppercase",
              color: colors.textMedium,
              letterSpacing: 1,
              marginLeft: spacing.xs,
            }}>
              Bonus Features
            </Text>
          </View>
          {smartSuggestions.length > 0 && (
            <Animated.View style={{
              backgroundColor: colors.white,
              borderRadius: borderRadius.lg,
              padding: spacing.xl,
              marginBottom: spacing.lg,
              ...elevation.sm,
            }}>
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: spacing.md }}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <MaterialIcons name="lightbulb" size={20} color="#FFB300" />
                  <Text style={[createScreenStyles.sectionLabel, { marginBottom: 0, marginLeft: spacing.sm }]}>
                    Smart Suggestions
                  </Text>
                </View>
                <Pressable onPress={() => setShowSmartSuggestions(!showSmartSuggestions)}>
                  <MaterialIcons
                    name={showSmartSuggestions ? "expand-less" : "expand-more"}
                    size={24}
                    color={colors.textMedium}
                  />
                </Pressable>
              </View>
              {showSmartSuggestions && (
                <View style={{ gap: spacing.sm }}>
                  {smartSuggestions.map((suggestion, index) => (
                    <Pressable
                      key={index}
                      onPress={() => handleAddSmartSuggestion(suggestion)}
                      style={({ pressed }) => ({
                        flexDirection: "row",
                        alignItems: "center",
                        padding: spacing.md,
                        backgroundColor: pressed ? colors.backgroundLight : `${colors.primary}05`,
                        borderRadius: borderRadius.md,
                        borderWidth: 1,
                        borderColor: `${colors.primary}20`,
                      })}
                    >
                      <Text style={{ fontSize: 18, marginRight: spacing.sm }}>
                        {suggestion.emoji || "Ã°Å¸â€™Â¡"}
                      </Text>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 15, fontWeight: "600", color: colors.textDark }}>
                          {suggestion.item}
                        </Text>
                        <Text style={{ fontSize: 12, color: colors.textMedium, marginTop: 2 }}>
                          {suggestion.reason}
                        </Text>
                      </View>
                      <MaterialIcons name="add-circle-outline" size={24} color={colors.primary} />
                    </Pressable>
                  ))}
                </View>
              )}
            </Animated.View>
          )}
          {activeChallenge && (
            <Animated.View style={{
              backgroundColor: activeChallenge.color + '15',
              borderRadius: borderRadius.lg,
              padding: spacing.lg,
              marginBottom: spacing.lg,
              borderWidth: 2,
              borderColor: activeChallenge.color,
            }}>
              <View style={{ flexDirection: "row", alignItems: "center", marginBottom: spacing.sm }}>
                <Text style={{ fontSize: 24, marginRight: spacing.sm }}>
                  {activeChallenge.emoji}
                </Text>
                <Text style={{ fontSize: 16, fontWeight: "700", color: activeChallenge.color, flex: 1 }}>
                  {activeChallenge.name}
                </Text>
                {speedTimerActive && speedTimer !== null && (
                  <View style={{
                    backgroundColor: colors.white,
                    paddingHorizontal: spacing.md,
                    paddingVertical: spacing.xs,
                    borderRadius: borderRadius.md,
                  }}>
                    <Text style={{ fontSize: 18, fontWeight: "700", color: speedTimer < 10 ? "#FF0000" : activeChallenge.color }}>
                      Ã¢ÂÂ±Ã¯Â¸Â {speedTimer}s
                    </Text>
                  </View>
                )}
              </View>
              <Text style={{ fontSize: 13, color: colors.textMedium, marginBottom: spacing.sm }}>
                {activeChallenge.description}
              </Text>
              <View style={{
                backgroundColor: colors.white,
                padding: spacing.sm,
                borderRadius: borderRadius.sm,
              }}>
                <Text style={{ fontSize: 12, fontWeight: "600", color: activeChallenge.color }}>
                  {challengeProgress}
                </Text>
              </View>
            </Animated.View>
          )}
          {showThemePicker && (
            <Animated.View style={{
              backgroundColor: colors.white,
              borderRadius: borderRadius.lg,
              padding: spacing.lg,
              marginBottom: spacing.lg,
              ...elevation.lg,
            }}>
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: spacing.md }}>
                <Text style={[typography.h3, { marginBottom: 0, color: colors.textDark }]}>
                  Choose Your Theme Ã°Å¸Å½Â²
                </Text>
                <Pressable onPress={() => setShowThemePicker(false)}>
                  <MaterialIcons name="close" size={24} color={colors.textMedium} />
                </Pressable>
              </View>
              <Text style={{ fontSize: 13, color: colors.textMedium, marginBottom: spacing.lg }}>
                Swipe to explore themes Ã¢â€ â€™
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: spacing.md, paddingRight: spacing.xl }}
              >
                <Pressable
                  onPress={handleRandomSurprise}
                  style={({ pressed }) => ({
                    width: 140,
                    padding: spacing.md,
                    backgroundColor: pressed ? `${colors.primary}15` : `${colors.primary}10`,
                    borderRadius: borderRadius.lg,
                    borderWidth: 2,
                    borderColor: colors.primary,
                    alignItems: "center",
                    justifyContent: "center",
                  })}
                >
                  <Text style={{ fontSize: 32, marginBottom: spacing.sm }}>Ã°Å¸Å½â€°</Text>
                  <Text style={{ fontSize: 14, fontWeight: "700", color: colors.primary, textAlign: "center" }}>
                    Random Surprise
                  </Text>
                </Pressable>
                {(Object.keys(THEMED_ITEMS) as Array<keyof typeof THEMED_ITEMS>).map((theme) => {
                  const themeText = theme.toString();
                  const emojiMatch = themeText.match(/[\u{1F300}-\u{1F9FF}]/u);
                  const emoji = emojiMatch ? emojiMatch[0] : "Ã°Å¸Å½Â¯";
                  const themeName = themeText.replace(/[\u{1F300}-\u{1F9FF}]/gu, "").trim();
                  return (
                    <Pressable
                      key={theme}
                      onPress={() => handleSelectTheme(theme)}
                      style={({ pressed }) => ({
                        width: 140,
                        padding: spacing.md,
                        backgroundColor: pressed ? colors.backgroundLight : colors.white,
                        borderRadius: borderRadius.lg,
                        borderWidth: 1.5,
                        borderColor: colors.border,
                        alignItems: "center",
                      })}
                    >
                      <Text style={{ fontSize: 32, marginBottom: spacing.sm }}>{emoji}</Text>
                      <Text style={{
                        fontSize: 13,
                        fontWeight: "700",
                        color: colors.textDark,
                        textAlign: "center",
                        lineHeight: 16,
                      }}>
                        {themeName}
                      </Text>
                      <Text style={{
                        fontSize: 11,
                        color: colors.textMedium,
                        textAlign: "center",
                        marginTop: spacing.xs,
                      }}>
                        +3 items
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
            </Animated.View>
          )}
          <Animated.View style={{
            backgroundColor: colors.white,
            borderRadius: borderRadius.lg,
            padding: spacing.xl,
            marginBottom: spacing.lg,
            ...elevation.sm,
            opacity: buttonsAnim,
            transform: [{
              translateY: buttonsAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0],
              }),
            }],
          }}>
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: spacing.lg }}>
              <View style={{
                width: 40,
                height: 40,
                borderRadius: borderRadius.round,
                backgroundColor: `${colors.primary}15`,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: spacing.md,
              }}>
                <MaterialIcons name="auto-awesome" size={22} color={colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[typography.h3, { marginBottom: 2, fontSize: 17 }]}>
                  Get Creative
                </Text>
                <Text style={{ fontSize: 12, color: colors.textMedium }}>
                  Add some fun to your list
                </Text>
              </View>
            </View>
            <View style={{ gap: spacing.md }}>
              <AnimatedPressable
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: spacing.lg,
                  backgroundColor: `${colors.primary}08`,
                  borderRadius: borderRadius.md,
                  borderWidth: 1,
                  borderColor: `${colors.primary}20`,
                }}
                onPress={handleSurpriseMe}
              >
                <View style={{
                  width: 48,
                  height: 48,
                  borderRadius: borderRadius.md,
                  backgroundColor: colors.primary,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: spacing.md,
                }}>
                  <MaterialIcons name="color-lens" size={24} color={colors.white} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 15, fontWeight: "700", color: colors.textDark, marginBottom: 3 }}>
                    Apply Theme
                  </Text>
                  <Text style={{ fontSize: 12, color: colors.textMedium }}>
                    Get 3 themed items instantly
                  </Text>
                </View>
                <MaterialIcons name="arrow-forward" size={20} color={colors.primary} />
              </AnimatedPressable>
              <AnimatedPressable
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: spacing.lg,
                  backgroundColor: `${colors.warning}10`,
                  borderRadius: borderRadius.md,
                  borderWidth: 1,
                  borderColor: `${colors.warning}30`,
                }}
                onPress={handleStartChallenge}
              >
                <View style={{
                  width: 48,
                  height: 48,
                  borderRadius: borderRadius.md,
                  backgroundColor: colors.warning,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: spacing.md,
                }}>
                  <MaterialIcons name="emoji-events" size={24} color={colors.white} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 15, fontWeight: "700", color: colors.textDark, marginBottom: 3 }}>
                    Try a Challenge
                  </Text>
                  <Text style={{ fontSize: 12, color: colors.textMedium }}>
                    15 fun shopping challenges
                  </Text>
                </View>
                <MaterialIcons name="arrow-forward" size={20} color={colors.warning} />
              </AnimatedPressable>
              <AnimatedPressable
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: spacing.lg,
                  backgroundColor: `${colors.success}10`,
                  borderRadius: borderRadius.md,
                  borderWidth: 1,
                  borderColor: `${colors.success}30`,
                }}
                onPress={handleExoticIngredient}
              >
                <View style={{
                  width: 48,
                  height: 48,
                  borderRadius: borderRadius.md,
                  backgroundColor: colors.success,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: spacing.md,
                }}>
                  <MaterialIcons name="explore" size={24} color={colors.white} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 15, fontWeight: "700", color: colors.textDark, marginBottom: 3 }}>
                    Add Exotic Ingredient
                  </Text>
                  <Text style={{ fontSize: 12, color: colors.textMedium }}>
                    Discover new flavors
                  </Text>
                </View>
                <MaterialIcons name="arrow-forward" size={20} color={colors.success} />
              </AnimatedPressable>
            </View>
          </Animated.View>
          <Pressable
            style={{ paddingVertical: spacing.lg, alignItems: "center", marginBottom: spacing.xl }}
            onPress={() => navigation.goBack()}
          >
            <Text style={{ color: colors.textMedium, fontSize: 15, fontWeight: "500" }}>
              Cancel
            </Text>
          </Pressable>
        </ScrollView>
        <Animated.View style={{
          position: "absolute",
          bottom: fabBottom,
          right: 20,
        }}>
          <FAB
            onPress={handleSaveList}
            icon="check"
            disabled={saving}
            loading={saving}
          />
        </Animated.View>
      </View>
    </KeyboardAvoidingView>
  );
};
export default CreateScreen;
