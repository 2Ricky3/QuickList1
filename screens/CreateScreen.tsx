import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Keyboard,
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
import { createList } from "../services/listService";
import { updateUserStats, getEncouragingMessage, getAchievements } from "../services/achievementService";
import { ModernLoader } from "../components/ModernLoader";
import { SwipeableInput } from "../components/SwipeableInput";
import { AnimatedPressable } from "../components/AnimatedPressable";
import { FAB } from "../components/FAB";
import { ConfettiCelebration } from "../components/ConfettiCelebration";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";

const EXAMPLE_TAGS = [
  "sales",
  "monthly buy",
  "groceries",
  "snacks",
  "weekly essentials",
  "cleaning",
  "beverages",
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
    "Kombucha", "Seaweed Snacks", "Miso Paste", "Star Fruit", "Açaí", "Tahini"
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
  const [tags, setTags] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [listColor, setListColor] = useState(COLOR_OPTIONS[0]);
  const [saving, setSaving] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const navigation = useNavigation();

  const getDisplayColor = (colorOption: typeof COLOR_OPTIONS[0]) => {
    return colorOption.type === 'solid' ? colorOption.color! : colorOption.colors![0];
  };

  const serializeColor = (colorOption: typeof COLOR_OPTIONS[0]) => {
    return JSON.stringify(colorOption);
  };

  const getLastTag = () => {
    const parts = tags.split(",");
    return parts[parts.length - 1].trim().toLowerCase();
  };

  const filteredSuggestions = EXAMPLE_TAGS.filter(
    (tag) =>
      tag.startsWith(getLastTag()) &&
      !tags
        .split(",")
        .map((t) => t.trim().toLowerCase())
        .includes(tag)
  );

  const addTagFromSuggestion = (tag: string) => {
    Keyboard.dismiss();

    const parts = tags.split(",");
    parts[parts.length - 1] = ` ${tag}`;
    const newTags = parts.join(",").replace(/^,*/, "").trimStart();
    setTags(newTags + ", ");
    setShowSuggestions(false);
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
    if (!listTitle.trim() || items.every((item) => !item.trim())) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Please enter a title and at least one item.");
      return;
    }

    setSaving(true);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      const user = auth.currentUser;
      if (!user) return;

      const tagsArray = tags
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0);

      await createList({
        uid: user.uid,
        title: listTitle,
        items: items.filter((i) => i.trim() !== ""),
        tags: tagsArray,
        color: serializeColor(listColor),
        shareId: uuidv4(),
        allowPublicEdit: false,
      });

      const achievements = await updateUserStats(user.uid, {
        listsCreated: 1,
        newTags: tagsArray,
        newColor: serializeColor(listColor),
      });

      const newlyUnlocked = achievements.filter(a => a.unlocked && a.progress === a.target);
      
      if (newlyUnlocked.length > 0) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3500);
        
        const achievementTitles = newlyUnlocked.map(a => a.title).join(", ");
        setTimeout(() => {
          Alert.alert(
            "🎉 Achievement Unlocked!",
            `${achievementTitles}\n\n${getEncouragingMessage(achievements)}`,
            [{ text: "Awesome!", style: "default" }]
          );
        }, 500);
      }

      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert("Success", "List created!" + (newlyUnlocked.length > 0 ? " 🎉" : ""));
      navigation.goBack();
    } catch (error) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Error", "Could not save list.");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleSurpriseMe = () => {
    const themes = Object.keys(THEMED_ITEMS) as Array<keyof typeof THEMED_ITEMS>;
    
    Alert.alert(
      "Choose Your Adventure! 🎲",
      "Pick a theme for surprise items:",
      [
        { text: "Cancel", style: "cancel" },
        ...themes.map(theme => ({
          text: theme,
          onPress: () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            const themeItems = THEMED_ITEMS[theme];
            const available = themeItems.filter(
              (item) => !items.some((i) => i.trim().toLowerCase() === item.toLowerCase())
            );
            
            if (available.length === 0) {
              Alert.alert("Oops!", "All items from this theme are already added!");
              return;
            }
            
            // Add 3 random items from the theme
            const randomItems = [];
            for (let i = 0; i < Math.min(3, available.length); i++) {
              const randomIndex = Math.floor(Math.random() * available.length);
              randomItems.push(available.splice(randomIndex, 1)[0]);
            }
            
            setItems([...items, ...randomItems]);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            
            // Track surprise usage
            if (auth.currentUser) {
              updateUserStats(auth.currentUser.uid, { surprisesUsed: 1 });
            }
          }
        })),
        {
          text: "🎉 Random Surprise",
          onPress: () => {
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
            
           
            if (auth.currentUser) {
              updateUserStats(auth.currentUser.uid, { surprisesUsed: 1 });
            }
          }
        }
      ]
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <View style={{ flex: 1, backgroundColor: colors.backgroundLight }}>
      
        <ConfettiCelebration show={showConfetti} />
        
        <ScrollView
          contentContainerStyle={[globalStyles.scrollContentWithBottomBar, { paddingBottom: 140 }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
         
          <View style={{
            backgroundColor: colors.white,
            borderRadius: borderRadius.lg,
            padding: spacing.xl,
            marginBottom: spacing.xxl,
            ...elevation.md,
          }}>
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: spacing.md }}>
              <MaterialIcons name="playlist-add" size={32} color={colors.primary} />
              <Text style={[globalStyles.titleText, { marginBottom: 0, marginLeft: spacing.md, flex: 1 }]}>
                New Grocery List
              </Text>
            </View>
            <Text style={{ ...typography.body, color: colors.textMedium }}>
              Create your shopping list quickly and easily
            </Text>
          </View>

          
          <View style={{
            backgroundColor: colors.white,
            borderRadius: borderRadius.lg,
            padding: spacing.xl,
            marginBottom: spacing.lg,
            ...elevation.sm,
          }}>
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: spacing.md }}>
              <MaterialIcons name="title" size={20} color={colors.primary} />
              <Text style={[createScreenStyles.sectionLabel, { marginBottom: 0, marginLeft: spacing.sm }]}>
                List Name
              </Text>
            </View>
            <TextInput
              style={[
                globalStyles.inputField,
                { marginBottom: 0 },
                focusedInput === 'title' && globalStyles.inputFieldFocused
              ]}
              placeholder="e.g., Weekly Groceries"
              placeholderTextColor={colors.textLight}
              value={listTitle}
              onChangeText={setListTitle}
              onFocus={() => setFocusedInput('title')}
              onBlur={() => setFocusedInput(null)}
              returnKeyType="done"
            />
          </View>

         
          <View style={{
            backgroundColor: colors.white,
            borderRadius: borderRadius.lg,
            padding: spacing.xl,
            marginBottom: spacing.lg,
            ...elevation.sm,
          }}>
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: spacing.md }}>
              <MaterialIcons name="shopping-basket" size={20} color={colors.primary} />
              <Text style={[createScreenStyles.sectionLabel, { marginBottom: 0, marginLeft: spacing.sm }]}>
                Items
              </Text>
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
          </View>

        
          <View style={{
            backgroundColor: colors.white,
            borderRadius: borderRadius.lg,
            padding: spacing.xl,
            marginBottom: spacing.lg,
            zIndex: 10,
            ...elevation.sm,
          }}>
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: spacing.md }}>
              <MaterialIcons name="label" size={20} color={colors.primary} />
              <Text style={[createScreenStyles.sectionLabel, { marginBottom: 0, marginLeft: spacing.sm }]}>
                Tags (Optional)
              </Text>
            </View>
            <View style={{ position: "relative" }}>
              <TextInput
                style={[
                  globalStyles.inputField,
                  focusedInput === 'tags' && globalStyles.inputFieldFocused,
                  showSuggestions && filteredSuggestions.length > 0 && {
                    borderBottomLeftRadius: 0,
                    borderBottomRightRadius: 0,
                    marginBottom: 0,
                  }
                ]}
                placeholder="e.g., groceries, weekly"
                placeholderTextColor={colors.textLight}
                value={tags}
                onChangeText={(text) => {
                  setTags(text);
                  setShowSuggestions(true);
                }}
                onFocus={() => {
                  setFocusedInput('tags');
                  setShowSuggestions(true);
                }}
                onBlur={() => {
                  setFocusedInput(null);
                  setTimeout(() => setShowSuggestions(false), 200);
                }}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="done"
              />
              <MaterialIcons
                name={showSuggestions && filteredSuggestions.length > 0 ? "arrow-drop-up" : "arrow-drop-down"}
                size={28}
                color={focusedInput === 'tags' ? colors.primary : colors.textLight} 
                style={{
                  position: "absolute",
                  right: spacing.md,
                  top: 10,
                  pointerEvents: "none",
                }}
              />
              
              {showSuggestions && filteredSuggestions.length > 0 && (
                <View style={createScreenStyles.suggestionsContainer}>
                  <ScrollView
                    keyboardShouldPersistTaps="handled"
                    nestedScrollEnabled={true}
                    showsVerticalScrollIndicator={false}
                    style={{ maxHeight: 150 }}
                  >
                    {filteredSuggestions.map((tag, index) => (
                      <Pressable
                        key={tag}
                        onPress={async () => {
                          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                          addTagFromSuggestion(tag);
                        }}
                        style={({ pressed }) => [
                          createScreenStyles.suggestionItem,
                          pressed && { backgroundColor: colors.backgroundLight },
                          index === filteredSuggestions.length - 1 && { borderBottomWidth: 0 }
                        ]}
                      >
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                          <MaterialIcons name="label" size={18} color={colors.primary} />
                          <Text style={[createScreenStyles.suggestionText, { marginLeft: spacing.sm }]}>
                            {tag}
                          </Text>
                        </View>
                      </Pressable>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>
            
           
            {tags.trim().length > 0 && (
              <View style={{ 
                flexDirection: "row", 
                flexWrap: "wrap", 
                gap: spacing.sm, 
                marginTop: spacing.md 
              }}>
                {tags.split(",").map((tag, index) => {
                  const trimmedTag = tag.trim();
                  if (!trimmedTag) return null;
                  const tagColor = getTagColor(trimmedTag);
                  return (
                    <View 
                      key={index}
                      style={{
                        paddingHorizontal: spacing.md,
                        paddingVertical: spacing.xs,
                        borderRadius: borderRadius.xl,
                        borderWidth: 1.5,
                        backgroundColor: tagColor.bg,
                        borderColor: tagColor.border,
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      <View style={{ 
                        width: 8, 
                        height: 8, 
                        borderRadius: 4, 
                        backgroundColor: tagColor.border 
                      }} />
                      <Text style={{ 
                        fontSize: 12, 
                        fontWeight: "600", 
                        color: tagColor.text 
                      }}>
                        {trimmedTag}
                      </Text>
                    </View>
                  );
                })}
              </View>
            )}
          </View>

          
          <View style={{
            backgroundColor: colors.white,
            borderRadius: borderRadius.lg,
            padding: spacing.xl,
            marginBottom: spacing.lg,
            ...elevation.sm,
          }}>
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: spacing.md }}>
              <MaterialIcons name="palette" size={20} color={colors.primary} />
              <Text style={[createScreenStyles.sectionLabel, { marginBottom: 0, marginLeft: spacing.sm }]}>
                List Color
              </Text>
            </View>
            <View style={{ 
              flexDirection: "row", 
              flexWrap: "wrap",
              gap: spacing.md,
              justifyContent: "flex-start",
            }}>
              {COLOR_OPTIONS.map((colorOption) => {
                const isSelected = listColor.id === colorOption.id;
                
                return colorOption.type === 'solid' ? (
                  <AnimatedPressable
                    key={colorOption.id}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setListColor(colorOption);
                    }}
                    scaleValue={0.85}
                    style={[
                      createScreenStyles.colorOption,
                      { 
                        backgroundColor: colorOption.color,
                        marginRight: 0,
                      },
                      isSelected 
                        ? createScreenStyles.colorOptionSelected 
                        : createScreenStyles.colorOptionUnselected,
                    ]}
                  >
                    {isSelected && (
                      <View style={{
                        flex: 1,
                        alignItems: "center",
                        justifyContent: "center",
                      }}>
                        <MaterialIcons name="check" size={28} color={colors.white} />
                      </View>
                    )}
                  </AnimatedPressable>
                ) : (
                  <AnimatedPressable
                    key={colorOption.id}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setListColor(colorOption);
                    }}
                    scaleValue={0.85}
                    style={[
                      createScreenStyles.colorOption,
                      { 
                        marginRight: 0,
                        overflow: "hidden",
                      },
                      isSelected 
                        ? createScreenStyles.colorOptionSelected 
                        : createScreenStyles.colorOptionUnselected,
                    ]}
                  >
                    <LinearGradient
                      colors={colorOption.colors! as [string, string, ...string[]]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={{
                        flex: 1,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {isSelected && (
                        <MaterialIcons name="check" size={28} color={colors.white} />
                      )}
                    </LinearGradient>
                  </AnimatedPressable>
                );
              })}
            </View>
          </View>

         
          <Pressable
            style={{ paddingVertical: spacing.lg, alignItems: "center", marginBottom: spacing.xl }}
            onPress={() => navigation.goBack()}
          >
            <Text style={{ color: colors.textMedium, fontSize: 15, fontWeight: "500" }}>
              Cancel
            </Text>
          </Pressable>
        </ScrollView>

        
        <FAB 
          onPress={handleSaveList}
          icon="check"
          disabled={saving}
          loading={saving}
        />

        
        <View style={createScreenStyles.bottomBar}>
          <AnimatedPressable
            style={[
              globalStyles.buttonContainer, 
              globalStyles.buttonContainerSecondary,
              createScreenStyles.bottomButton
            ]}
            onPress={handleAddItem}
          >
            <MaterialIcons name="add" size={20} color={colors.primary} style={{ marginRight: 4 }} />
            <Text style={[globalStyles.buttonTextSecondary, { fontSize: 15, fontWeight: "600" }]}>Add Item</Text>
          </AnimatedPressable>

          <AnimatedPressable
            style={[
              globalStyles.buttonContainer, 
              globalStyles.buttonContainerSecondary,
              createScreenStyles.bottomButton
            ]}
            onPress={handleSurpriseMe}
          >
            <MaterialIcons name="auto-awesome" size={20} color={colors.primary} style={{ marginRight: 4 }} />
            <Text style={[globalStyles.buttonTextSecondary, { fontSize: 15, fontWeight: "600" }]}>Surprise</Text>
          </AnimatedPressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default CreateScreen;
