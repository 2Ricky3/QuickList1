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
            returnKeyType="next"
          />

          <TextInput
            value={items}
            onChangeText={setItems}
            placeholder="Items (comma separated)"
            style={[styles.inputField, styles.itemsInput]}
            multiline
            returnKeyType="done"
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
        </ScrollView>
        <View style={styles.bottomBar}>
          <Pressable
            style={[
              styles.bottomButton,
              {
                backgroundColor: "#fff",
                borderColor: "#C20200",
                borderWidth: 1,
                marginRight: 8,
              },
            ]}
            onPress={() => navigation.goBack()}
          >
            <Text style={[styles.buttonText, { color: "#C20200" }]}>Cancel</Text>
          </Pressable>
          <Pressable
            style={[styles.bottomButton, { backgroundColor: "#C20200" }]}
            onPress={handleSave}
          >
            <Text style={styles.buttonText}>Save Changes</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 0,
    paddingTop: 0,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 100, 
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
    marginBottom: 20,
    fontSize: 18,
    backgroundColor: "#f8f8f8",
    color: "#520600",
    width: "100%",
    alignSelf: "center",
  },
  itemsInput: {
    height: 100,
    textAlignVertical: "top",
  },
  toggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
    justifyContent: "space-between",
    paddingHorizontal: 4,
  },
  toggleLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: "#C20200",
  },
 bottomBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 15,
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 16,
    borderTopWidth: 1,
    borderColor: "#eee",
    justifyContent: "space-between",
    alignItems: "center",
  },
  bottomButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontWeight: "600",
    fontSize: 16,
    color: "#fff",
  },
});

export default EditListScreen;
