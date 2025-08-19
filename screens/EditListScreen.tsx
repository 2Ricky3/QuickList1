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
import { useNavigation, useRoute } from "@react-navigation/native";
import { updateList } from "../services/listService";

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
      await updateList(list.id, {
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
      <SafeAreaView style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.headerTitle}>Edit List</Text>

          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="List Title"
            style={styles.inputField}
          />

          <TextInput
            value={items}
            onChangeText={setItems}
            placeholder="Items (comma separated)"
            style={[styles.inputField, styles.itemsInput]}
            multiline
          />

          <View style={styles.toggleContainer}>
            <Text style={styles.toggleLabel}>Allow Public Edit</Text>
            <Switch
              value={allowPublicEdit}
              onValueChange={setAllowPublicEdit}
              thumbColor={allowPublicEdit ? "#C20200" : "#f4f3f4"}
              trackColor={{ false: "#767577", true: "#f4f3f4" }}
            />
          </View>

          <Pressable onPress={handleSave} style={styles.buttonContainer}>
            <Text style={styles.buttonText}>Save Changes</Text>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#C20200",
    marginBottom: 24,
    textAlign: "center",
  },
  inputField: {
    height: 48,
    borderWidth: 1.5,
    borderColor: "#C20200",
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,

    marginHorizontal: 8,

    fontSize: 16,
    backgroundColor: "#f8f8f8",
    color: "#520600",

    alignSelf: "center",
    width: "95%",
  },
  itemsInput: {
    height: 100,
    textAlignVertical: "top",
  },
  toggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 16,
    justifyContent: "space-between",
    marginHorizontal: 8,
  },
  toggleLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#C20200",
  },
  buttonContainer: {
    backgroundColor: "#C20200",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
    marginHorizontal: 8,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 4,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});

export default EditListScreen;
