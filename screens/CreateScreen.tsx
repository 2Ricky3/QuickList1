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
import { Swipeable } from "react-native-gesture-handler";
import { FontAwesome } from "@expo/vector-icons";
import { auth } from "../firebaseConfig";
import { v4 as uuidv4 } from "uuid";
import "react-native-get-random-values";
import { globalStyles, colors, createScreenStyles } from "../GlobalStyleSheet";
import { createList } from "../services/listService";

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
  "Mango",
  "Fancy Cheese",
  "Mystery Snack",
  "Surprise Fruit",
  "Gourmet Cookie",
  "Exotic Juice",
  "Special Treat",
];

const COLOR_OPTIONS = [
  "#FFD700", 
  "#FF6347", 
  "#4CAF50", 
  "#2196F3", 
  "#9C27B0", 
  "#FF9800",
  "#E91E63", 
];

const CreateScreen = () => {
  const [listTitle, setListTitle] = useState("");
  const [items, setItems] = useState([""]);
  const [tags, setTags] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [listColor, setListColor] = useState(COLOR_OPTIONS[0]);
  const navigation = useNavigation();

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
    setItems([...items, ""]);
  };

  const handleItemChange = (text: string, index: number) => {
    const updated = [...items];
    updated[index] = text;
    setItems(updated);
  };

  const handleDeleteItem = (index: number) => {
    const updated = [...items];
    updated.splice(index, 1);
    setItems(updated);
  };

  const handleSaveList = async () => {
    if (!listTitle.trim() || items.every((item) => !item.trim())) {
      Alert.alert("Please enter a title and at least one item.");
      return;
    }

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
        color: listColor,
        shareId: uuidv4(),
        allowPublicEdit: false,
      });

      Alert.alert("Success", "List created!");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", "Could not save list.");
      console.error(error);
    }
  };

  const handleSurpriseMe = () => {
    const available = RANDOM_ITEMS.filter(
      (item) => !items.some((i) => i.trim().toLowerCase() === item.toLowerCase())
    );
    if (available.length === 0) {
      Alert.alert("All surprises already added!");
      return;
    }
    const randomItem = available[Math.floor(Math.random() * available.length)];
    setItems([...items, randomItem]);
  };

  const renderRightActions = (index: number) => (
    <View style={createScreenStyles.deleteButtonContainer}>
      <Pressable
        style={createScreenStyles.deleteButton}
        onPress={() => handleDeleteItem(index)}
      >
        <FontAwesome name="trash" size={20} color={colors.white} />
      </Pressable>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      <View style={globalStyles.container}>
        <ScrollView
          contentContainerStyle={globalStyles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={globalStyles.titleText}>New Grocery List</Text>

          <TextInput
            style={globalStyles.inputField}
            placeholder="List title"
            value={listTitle}
            onChangeText={setListTitle}
            returnKeyType="done"
          />

          {items.map((item, index) => (
            <Swipeable
              key={index}
              renderRightActions={() => renderRightActions(index)}
              overshootRight={false}
            >
              <TextInput
                style={[globalStyles.inputField, { marginBottom: 12 }]}
                placeholder={`Item ${index + 1}`}
                value={item}
                onChangeText={(text) => handleItemChange(text, index)}
                returnKeyType="done"
              />
            </Swipeable>
          ))}

          <View style={{ marginBottom: 8 }}>
            <TextInput
              style={globalStyles.inputField}
              placeholder="Tags (comma separated)"
              value={tags}
              onChangeText={(text) => {
                setTags(text);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => {
                setTimeout(() => setShowSuggestions(false), 150);
              }}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="done"
            />

            {/* Suggestions dropdown */}
            {showSuggestions && filteredSuggestions.length > 0 && (
              <ScrollView
                style={createScreenStyles.suggestionsContainer}
                keyboardShouldPersistTaps="handled"
                nestedScrollEnabled={true}
              >
                {filteredSuggestions.map((tag) => (
                  <TouchableOpacity
                    key={tag}
                    onPress={() => addTagFromSuggestion(tag)}
                    style={createScreenStyles.suggestionItem}
                  >
                    <Text style={createScreenStyles.suggestionText}>{tag}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </View>

          {/* Color Picker */}
          <Text style={{ fontWeight: "bold", marginBottom: 6, marginTop: 12 }}>
            List Color
          </Text>
          <View style={{ flexDirection: "row", marginBottom: 16 }}>
            {COLOR_OPTIONS.map((color) => (
              <Pressable
                key={color}
                onPress={() => setListColor(color)}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: color,
                  marginRight: 12,
                  borderWidth: listColor === color ? 3 : 1,
                  borderColor: listColor === color ? "#333" : "#ccc",
                }}
              />
            ))}
          </View>

          <Pressable
            style={[globalStyles.buttonContainer, { marginBottom: 8, backgroundColor: "#FFD700" }]}
            onPress={handleSurpriseMe}
          >
            <Text style={[globalStyles.buttonText, { color: "#C20200" }]}>
              🎲 Surprise Me!
            </Text>
          </Pressable>

          <Pressable
            style={[globalStyles.buttonContainer, { marginBottom: 16 }]}
            onPress={handleAddItem}
          >
            <Text style={globalStyles.buttonText}>+ Add Item</Text>
          </Pressable>

          <Pressable style={globalStyles.buttonContainer} onPress={handleSaveList}>
            <Text style={globalStyles.buttonText}>Save List</Text>
          </Pressable>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

export default CreateScreen;
