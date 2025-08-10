import React, { useState } from "react";
import {
  Text,
  SafeAreaView,
  TextInput,
  Pressable,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { globalStyles } from "../GlobalStyleSheet";
import { useNavigation, useRoute } from "@react-navigation/native";

const EditListScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { list } = route.params as { list: any };

  const [title, setTitle] = useState(list.title);
  const [items, setItems] = useState(list.items?.join(", ") || "");

  const handleSave = async () => {
    try {
      const listRef = doc(db, "lists", list.id);
      await updateDoc(listRef, {
        title: title.trim(),
        items: items.split(",").map((i: string) => i.trim()),
      });
      Alert.alert("Success", "List updated successfully!");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", "Failed to update list.");
      console.error(error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0} 
    >
      <SafeAreaView style={globalStyles.container}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={globalStyles.headerTitle}>Edit List</Text>

          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="List Title"
            style={globalStyles.inputField}
          />

          <TextInput
            value={items}
            onChangeText={setItems}
            placeholder="Items (comma separated)"
            style={globalStyles.inputField}
            multiline
          />

          <Pressable onPress={handleSave} style={globalStyles.buttonContainer}>
            <Text style={globalStyles.buttonText}>Save Changes</Text>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default EditListScreen;
