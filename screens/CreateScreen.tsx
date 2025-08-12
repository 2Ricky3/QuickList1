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
  StyleSheet,
  TouchableOpacity,
  Keyboard,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Swipeable } from "react-native-gesture-handler";
import { FontAwesome } from "@expo/vector-icons";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import { v4 as uuidv4 } from "uuid";
import "react-native-get-random-values";
import { globalStyles, colors } from "../GlobalStyleSheet";

const EXAMPLE_TAGS = [
  "sales",
  "monthly buy",
  "groceries",
  "snacks",
  "weekly essentials",
  "cleaning",
  "beverages",
];

const CreateScreen = () => {
  const [listTitle, setListTitle] = useState("");
  const [items, setItems] = useState([""]);
  const [tags, setTags] = useState(""); 
  const [showSuggestions, setShowSuggestions] = useState(false);
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

      await addDoc(collection(db, "lists"), {
        uid: user.uid,
        title: listTitle,
        items: items.filter((i) => i.trim() !== ""),
        tags: tagsArray,
        createdAt: Timestamp.now(),
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

  const renderRightActions = (index: number) => (
    <View style={styles.deleteButtonContainer}>
      <Pressable
        style={styles.deleteButton}
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
                style={styles.suggestionsContainer}
                keyboardShouldPersistTaps="handled"
                nestedScrollEnabled={true}
              >
                {filteredSuggestions.map((tag) => (
                  <TouchableOpacity
                    key={tag}
                    onPress={() => addTagFromSuggestion(tag)}
                    style={styles.suggestionItem}
                  >
                    <Text style={styles.suggestionText}>{tag}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </View>

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

const styles = StyleSheet.create({
  deleteButtonContainer: {
    justifyContent: "center",
    alignItems: "center",
    height: 48,
  },
  deleteButton: {
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    width: 60,
    height: 48,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
  suggestionsContainer: {
    backgroundColor: "#fff",
    borderColor: colors.primary,
    borderWidth: 1,
    borderTopWidth: 0,
    borderRadius: 8,
    marginHorizontal: 4,
    marginTop: -6,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    width: "95%",
    alignSelf: "center",
    maxHeight: 140,
  },
  suggestionItem: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
  },
  suggestionText: {
    color: colors.primary,
    fontWeight: "600",
    fontSize: 16,
  },
});

export default CreateScreen;
