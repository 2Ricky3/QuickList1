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
  View,
  Switch,
  StyleSheet,
} from "react-native";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { globalStyles, colors } from "../GlobalStyleSheet";
import { useNavigation, useRoute } from "@react-navigation/native";

const EditListScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { list } = route.params as { list: any };

  const [title, setTitle] = useState(list.title);
  const [items, setItems] = useState(list.items?.join(", ") || "");
  const [allowPublicEdit, setAllowPublicEdit] = useState(
    list.allowPublicEdit ?? false
  );

  const handleSave = async () => {
    try {
      const listRef = doc(db, "lists", list.id);
      await updateDoc(listRef, {
        title: title.trim(),
        items: items.split(",").map((i: string) => i.trim()),
        allowPublicEdit: allowPublicEdit,
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
            style={[globalStyles.inputField, { height: 100, textAlignVertical: "top" }]}
            multiline
          />

          <View style={styles.toggleContainer}>
            <Text style={[styles.toggleLabel, { color: colors.primary }]}>
              Allow Public Edit
            </Text>
            <Switch
              value={allowPublicEdit}
              onValueChange={setAllowPublicEdit}
              thumbColor={allowPublicEdit ? colors.primary : "#f4f3f4"}
              trackColor={{ false: "#767577", true: "#f4f3f4" }}
            />
          </View>

          <Pressable onPress={handleSave} style={globalStyles.buttonContainer}>
            <Text style={globalStyles.buttonText}>Save Changes</Text>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  toggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 16,
    justifyContent: "space-between",
  },
  toggleLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
});

export default EditListScreen;
