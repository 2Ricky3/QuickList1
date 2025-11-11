import AsyncStorage from "@react-native-async-storage/async-storage";

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
];

export const getAchievements = async (userId: string): Promise<Achievement[]> => {
  try {
    const stats = await getUserStats(userId);
    
    return ACHIEVEMENTS.map((achievement) => {
      let progress = 0;
      
      switch (achievement.category) {
        case "lists":
          progress = stats.listsCreated;
          break;
        case "tags":
          progress = stats.tagsUsed.size;
          break;
        case "colors":
          progress = stats.colorsUsed.size;
          break;
        case "shares":
          progress = stats.listsShared;
          break;
        case "surprise":
          progress = stats.surprisesUsed;
          break;
      }
      
      return {
        ...achievement,
        progress,
        unlocked: progress >= achievement.target,
      };
    });
  } catch (error) {
    console.error("Error getting achievements:", error);
    return [];
  }
};

export const getUserStats = async (userId: string): Promise<UserStats> => {
  try {
    const statsJson = await AsyncStorage.getItem(`userStats:${userId}`);
    if (statsJson) {
      const parsed = JSON.parse(statsJson);
      return {
        ...parsed,
        tagsUsed: new Set(parsed.tagsUsed || []),
        colorsUsed: new Set(parsed.colorsUsed || []),
      };
    }
  } catch (error) {
    console.error("Error getting user stats:", error);
  }
  
  return {
    listsCreated: 0,
    tagsUsed: new Set(),
    colorsUsed: new Set(),
    listsShared: 0,
    surprisesUsed: 0,
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
    
   
    const statsToSave = {
      ...stats,
      tagsUsed: Array.from(stats.tagsUsed),
      colorsUsed: Array.from(stats.colorsUsed),
    };
    
    await AsyncStorage.setItem(`userStats:${userId}`, JSON.stringify(statsToSave));
    
  
    return await getAchievements(userId);
  } catch (error) {
    console.error("Error updating user stats:", error);
    return [];
  }
};

export const getEncouragingMessage = (achievements: Achievement[]): string => {
  const messages = [
    "Great job! Keep organizing! 🎉",
    "You're on fire! 🔥",
    "Amazing work! 🌟",
    "Your lists are looking fantastic! ✨",
    "You're a planning pro! 🏆",
    "Keep up the excellent work! 💪",
    "You're crushing it! 🎊",
    "Fantastic organization skills! 📝",
    "You're becoming a list legend! 👑",
    "Incredible progress! 🚀",
  ];
  
  const unlockedCount = achievements.filter(a => a.unlocked).length;
  
  if (unlockedCount === 0) {
    return "Start your journey to becoming a list master! 🌟";
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
