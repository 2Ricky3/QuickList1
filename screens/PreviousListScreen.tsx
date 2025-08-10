import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Alert,
} from "react-native";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { auth, db } from "../firebaseConfig";
import { colors } from "../GlobalStyleSheet";

const PreviousListScreen = () => {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const fetchLists = async () => {
    try {
      setLoading(true);
      const user = auth.currentUser;
      if (!user) return;

      const q = query(collection(db, "lists"), where("uid", "==", user.uid));
      const querySnapshot = await getDocs(q);
      const fetchedLists = [];

      querySnapshot.forEach((docSnap) => {
        fetchedLists.push({ id: docSnap.id, ...docSnap.data() });
      });

      setLists(fetchedLists);
    } catch (error) {
      Alert.alert("Error", "Failed to load lists.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchLists();
    }, [])
  );

  const handleDeleteList = async (listId) => {
    Alert.alert(
      "Delete List",
      "Are you sure you want to delete this list?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteDoc(doc(db, "lists", listId));
              setLists((prev) => prev.filter((item) => item.id !== listId));
            } catch (error) {
              Alert.alert("Error", "Failed to delete list.");
              console.error(error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  if (loading) {
    return (
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text
          style={{
            fontSize: 22,
            fontWeight: "bold",
            color: colors.primary,
            marginBottom: 20,
          }}
        >
          Previous Lists
        </Text>

        {lists.length === 0 ? (
          <Text style={{ color: "#999", fontSize: 16 }}>No lists found.</Text>
        ) : (
          lists.map((list) => (
            <View
              key={list.id}
              style={{
                backgroundColor: "#fff",
                borderRadius: 12,
                borderColor: colors.primary,
                borderWidth: 1,
                marginBottom: 16,
                padding: 16,
                shadowColor: "#000",
                shadowOpacity: 0.08,
                shadowRadius: 4,
                elevation: 3,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "bold",
                    color: colors.primary,
                  }}
                >
                  {list.title}
                </Text>

                <View style={{ flexDirection: "row", gap: 12 }}>
                  <Pressable
                    onPress={() => navigation.navigate("EditListScreen", { list })}
                  >
                    <Text style={{ color: colors.primary, fontSize: 14 }}>
                      Edit
                    </Text>
                  </Pressable>

                  <Pressable onPress={() => handleDeleteList(list.id)}>
                    <Text style={{ color: "red", fontSize: 14 }}>Delete</Text>
                  </Pressable>
                </View>
              </View>

              <Text style={{ marginTop: 8, fontSize: 14, color: "#555" }}>
                {list.items?.join(", ")}
              </Text>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default PreviousListScreen;
