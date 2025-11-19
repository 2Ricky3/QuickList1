import AsyncStorage from "@react-native-async-storage/async-storage";
import { errorLogger } from "./errorLogger";
export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  target: number;
  category: "lists" | "tags" | "colors" | "shares" | "surprise";
}
export interface UserStats {
  listsCreated: number;
  tagsUsed: Set<string>;
  colorsUsed: Set<string>;
  listsShared: number;
  surprisesUsed: number;
  firstListDate?: string;
  uniqueItems: Set<string>;
  themedListsCompleted: number;
  emojisUsed: number;
  creativeListNames: number;
  themesUsed: Set<string>;
  challengesCompleted: number;
}
const ACHIEVEMENTS: Omit<Achievement, "unlocked" | "progress">[] = [
  {
    id: "first_list",
    title: "Getting Started",
    description: "Create your first list",
    icon: "check-circle",
    target: 1,
    category: "lists",
  },
  {
    id: "list_master",
    title: "List Master",
    description: "Create 10 lists",
    icon: "star",
    target: 10,
    category: "lists",
  },
  {
    id: "prolific_planner",
    title: "Prolific Planner",
    description: "Create 25 lists",
    icon: "stars",
    target: 25,
    category: "lists",
  },
  {
    id: "tag_explorer",
    title: "Tag Explorer",
    description: "Use 5 different tags",
    icon: "label",
    target: 5,
    category: "tags",
  },
  {
    id: "organized_guru",
    title: "Organized Guru",
    description: "Use tags on 10 lists",
    icon: "label-important",
    target: 10,
    category: "tags",
  },
  {
    id: "color_collector",
    title: "Color Collector",
    description: "Use all color options",
    icon: "palette",
    target: 22,
    category: "colors",
  },
  {
    id: "rainbow_master",
    title: "Rainbow Master",
    description: "Use 10 different colors",
    icon: "color-lens",
    target: 10,
    category: "colors",
  },
  {
    id: "sharing_caring",
    title: "Sharing is Caring",
    description: "Share 3 lists",
    icon: "share",
    target: 3,
    category: "shares",
  },
  {
    id: "surprise_seeker",
    title: "Surprise Seeker",
    description: "Use Surprise Me 10 times",
    icon: "auto-awesome",
    target: 10,
    category: "surprise",
  },
  {
    id: "adventure_lover",
    title: "Adventure Lover",
    description: "Use Surprise Me 25 times",
    icon: "explore",
    target: 25,
    category: "surprise",
  },
  {
    id: "adventurous_eater",
    title: "Adventurous Eater",
    description: "Add 10 unique items you've never bought before",
    icon: "restaurant",
    target: 10,
    category: "lists",
  },
  {
    id: "chefs_choice",
    title: "Chef's Choice",
    description: "Complete 5 themed lists",
    icon: "restaurant-menu",
    target: 5,
    category: "surprise",
  },
  {
    id: "emoji_master",
    title: "Emoji Master",
    description: "Use emojis on 20 items",
    icon: "emoji-emotions",
    target: 20,
    category: "lists",
  },
  {
    id: "creative_namer",
    title: "Creative Namer",
    description: "Give unique names to 10 lists",
    icon: "edit",
    target: 10,
    category: "lists",
  },
  {
    id: "mix_master",
    title: "Mix Master",
    description: "Use items from 3 different themes in one list",
    icon: "shuffle",
    target: 3,
    category: "surprise",
  },
];
export const getAchievements = async (userId: string): Promise<Achievement[]> => {
  try {
    const stats = await getUserStats(userId);
    return ACHIEVEMENTS.map((achievement) => {
      let progress = 0;
      switch (achievement.id) {
        case "first_list":
        case "list_master":
        case "prolific_planner":
          progress = stats.listsCreated;
          break;
        case "tag_explorer":
        case "organized_guru":
          progress = stats.tagsUsed.size;
          break;
        case "color_collector":
        case "rainbow_master":
          progress = stats.colorsUsed.size;
          break;
        case "sharing_caring":
          progress = stats.listsShared;
          break;
        case "surprise_seeker":
        case "adventure_lover":
          progress = stats.surprisesUsed;
          break;
        case "adventurous_eater":
          progress = stats.uniqueItems.size;
          break;
        case "chefs_choice":
          progress = stats.themedListsCompleted;
          break;
        case "emoji_master":
          progress = stats.emojisUsed;
          break;
        case "creative_namer":
          progress = stats.creativeListNames;
          break;
        case "mix_master":
          progress = stats.themesUsed.size;
          break;
        default:
          progress = 0;
      }
      return {
        ...achievement,
        progress,
        unlocked: progress >= achievement.target,
      };
    });
  } catch (error) {
    errorLogger.logError(error, {
      screen: 'achievementService',
      action: 'Get achievements',
      metadata: { userId }
    });
    return [];
  }
};
export const getUserStats = async (userId: string): Promise<UserStats> => {
  try {
    const statsJson = await AsyncStorage.getItem(`userStats:${userId}`);
    if (statsJson) {
      const parsed = JSON.parse(statsJson);
      return {
        listsCreated: parsed.listsCreated || 0,
        tagsUsed: new Set(parsed.tagsUsed || []),
        colorsUsed: new Set(parsed.colorsUsed || []),
        listsShared: parsed.listsShared || 0,
        surprisesUsed: parsed.surprisesUsed || 0,
        firstListDate: parsed.firstListDate,
        uniqueItems: new Set(parsed.uniqueItems || []),
        themedListsCompleted: parsed.themedListsCompleted || 0,
        emojisUsed: parsed.emojisUsed || 0,
        creativeListNames: parsed.creativeListNames || 0,
        themesUsed: new Set(parsed.themesUsed || []),
        challengesCompleted: parsed.challengesCompleted || 0,
      };
    }
  } catch (error) {
    errorLogger.logError(error, {
      screen: 'achievementService',
      action: 'Get user stats',
      metadata: { userId }
    });
  }
  return {
    listsCreated: 0,
    tagsUsed: new Set(),
    colorsUsed: new Set(),
    listsShared: 0,
    surprisesUsed: 0,
    uniqueItems: new Set(),
    themedListsCompleted: 0,
    emojisUsed: 0,
    creativeListNames: 0,
    themesUsed: new Set(),
    challengesCompleted: 0,
  };
};
export const updateUserStats = async (
  userId: string,
  updates: Partial<{
    listsCreated: number;
    newTags: string[];
    newColor: string;
    listsShared: number;
    surprisesUsed: number;
    newItems: string[];
    themedListCompleted: boolean;
    emojisAdded: number;
    creativeName: boolean;
    themesUsed: string[];
    challengeCompleted: boolean;
  }>
): Promise<Achievement[]> => {
  try {
    const stats = await getUserStats(userId);
    if (updates.listsCreated !== undefined) {
      stats.listsCreated += updates.listsCreated;
      if (stats.listsCreated === 1) {
        stats.firstListDate = new Date().toISOString();
      }
    }
    if (updates.newTags) {
      updates.newTags.forEach(tag => stats.tagsUsed.add(tag));
    }
    if (updates.newColor) {
      stats.colorsUsed.add(updates.newColor);
    }
    if (updates.listsShared !== undefined) {
      stats.listsShared += updates.listsShared;
    }
    if (updates.surprisesUsed !== undefined) {
      stats.surprisesUsed += updates.surprisesUsed;
    }
    if (updates.newItems) {
      updates.newItems.forEach(item => stats.uniqueItems.add(item.toLowerCase()));
    }
    if (updates.themedListCompleted) {
      stats.themedListsCompleted += 1;
    }
    if (updates.emojisAdded !== undefined) {
      stats.emojisUsed += updates.emojisAdded;
    }
    if (updates.creativeName) {
      stats.creativeListNames += 1;
    }
    if (updates.themesUsed) {
      updates.themesUsed.forEach(theme => stats.themesUsed.add(theme));
    }
    if (updates.challengeCompleted) {
      stats.challengesCompleted += 1;
    }
    const statsToSave = {
      ...stats,
      tagsUsed: Array.from(stats.tagsUsed),
      colorsUsed: Array.from(stats.colorsUsed),
      uniqueItems: Array.from(stats.uniqueItems),
      themesUsed: Array.from(stats.themesUsed),
    };
    await AsyncStorage.setItem(`userStats:${userId}`, JSON.stringify(statsToSave));
    return await getAchievements(userId);
  } catch (error) {
    errorLogger.logError(error, {
      screen: 'achievementService',
      action: 'Update user stats',
      metadata: { userId, updates }
    });
    return [];
  }
};
export const getEncouragingMessage = (achievements: Achievement[]): string => {
  const messages = [
    "Great job! Keep organizing! 🎉",
    "You're on fire! 🔥",
    "Amazing work! 💪",
    "Your lists are looking fantastic! ✨",
    "You're a planning pro! 🏆",
    "Keep up the excellent work! 🎪",
    "You're crushing it! 🎊",
    "Fantastic organization skills! 📋",
    "You're becoming a list legend! 👑",
    "Incredible progress! 💯",
  ];
  const unlockedCount = achievements.filter(a => a.unlocked).length;
  if (unlockedCount === 0) {
    return "Start your journey to becoming a list master! 💪";
  } else if (unlockedCount < 3) {
    return "Great start! Keep going! 🎯";
  } else if (unlockedCount < 6) {
    return messages[Math.floor(Math.random() * messages.length)];
  } else if (unlockedCount < achievements.length) {
    return "You're almost there! Keep pushing! 🔥";
  } else {
    return "You've unlocked everything! You're a legend! 👑🎉";
  }
};
