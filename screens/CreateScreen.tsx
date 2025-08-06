import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Swipeable } from "react-native-gesture-handler";
import { FontAwesome } from "@expo/vector-icons";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import { globalStyles, colors } from "../GlobalStyleSheet";

const CreateScreen = () => {
  const [listTitle, setListTitle] = useState("");
  const [items, setItems] = useState([""]);
  const navigation = useNavigation();

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

      await addDoc(collection(db, "lists"), {
        uid: user.uid,
        title: listTitle,
        items: items.filter((i) => i.trim() !== ""),
        createdAt: Timestamp.now(),
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
    <ScrollView contentContainerStyle={globalStyles.container}>
      <Text style={globalStyles.titleText}>New Grocery List</Text>

      <TextInput
        style={globalStyles.inputField}
        placeholder="List title"
        value={listTitle}
        onChangeText={setListTitle}
      />

      {items.map((item, index) => (
        <Swipeable
          key={index}
          renderRightActions={() => renderRightActions(index)}
          overshootRight={false}
        >
          <TextInput
            style={globalStyles.inputField}
            placeholder={`Item ${index + 1}`}
            value={item}
            onChangeText={(text) => handleItemChange(text, index)}
          />
        </Swipeable>
      ))}

      <Pressable style={globalStyles.buttonContainer} onPress={handleAddItem}>
        <Text style={globalStyles.buttonText}>+ Add Item</Text>
      </Pressable>

      <Pressable style={globalStyles.buttonContainer} onPress={handleSaveList}>
        <Text style={globalStyles.buttonText}>Save List</Text>
      </Pressable>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  inputWrapper: {
    backgroundColor: colors.white,  
    borderRadius: 12,
    marginVertical: 4, 
    overflow: "hidden",  
  },
  inputWithoutRadius: {
    height: 48, 
    paddingHorizontal: 12,
    backgroundColor: colors.white,
    borderRadius: 0, 
    fontSize: 16,
  },
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
});


export default CreateScreen;
