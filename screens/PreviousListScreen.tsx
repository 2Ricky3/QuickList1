import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Alert,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  limit,
} from "firebase/firestore";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { auth, db } from "../firebaseConfig";
import { colors } from "../GlobalStyleSheet";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import * as Clipboard from "expo-clipboard";

const PreviousListScreen = () => {
  const [lists, setLists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [shareCode, setShareCode] = useState("");
  const [loadingShared, setLoadingShared] = useState(false);
  const navigation = useNavigation();

  const fetchLists = async () => {
    try {
      setLoading(true);
      const user = auth.currentUser;
      if (!user) return;

      const q = query(collection(db, "lists"), where("uid", "==", user.uid));
      const querySnapshot = await getDocs(q);
      const fetchedLists: any[] = [];

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

  const handleDeleteList = async (listId: string) => {
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

  const handleFetchSharedList = async () => {
    const code = shareCode.trim();
    if (!code) {
      Alert.alert("Error", "Please enter a share code.");
      return;
    }

    setLoadingShared(true);

    try {
      const q = query(
        collection(db, "lists"),
        where("shareId", "==", code),
        limit(1)
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        Alert.alert("Not Found", "No list found for this code.");
        setLoadingShared(false);
        return;
      }

      const docSnap = querySnapshot.docs[0];
      const sharedList = { id: docSnap.id, ...docSnap.data() };

      navigation.navigate("EditListScreen", { list: sharedList });
      setShareCode("");
    } catch (error) {
      Alert.alert("Error", "Failed to fetch shared list.");
      console.error(error);
    } finally {
      setLoadingShared(false);
    }
  };

  const handleCopyShareCode = async (code: string | undefined) => {
    if (!code) {
      Alert.alert("Error", "This list cannot be shared.");
      return;
    }
    try {
      await Clipboard.setStringAsync(code);
      Alert.alert("Copied!", "Share code copied to clipboard.");
    } catch (e) {
      Alert.alert("Error", "Failed to copy share code.");
      console.error(e);
    }
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
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ padding: 20 }}>
          <Text
            style={{
              fontSize: 22,
              fontWeight: "bold",
              color: colors.primary,
              marginBottom: 16,
              textAlign: "center",
            }}
          >
            Open Shared List by Code
          </Text>

          <View style={styles.shareCodeContainer}>
            <TextInput
              style={styles.shareCodeInput}
              placeholder="Enter share code"
              value={shareCode}
              onChangeText={setShareCode}
              autoCapitalize="none"
              autoCorrect={false}
              editable={!loadingShared}
            />
            <Pressable
              style={styles.shareCodeButton}
              onPress={handleFetchSharedList}
              disabled={loadingShared}
            >
              <Text style={styles.shareCodeButtonText}>
                {loadingShared ? "Loading..." : "Open"}
              </Text>
            </Pressable>
          </View>

          <Text
            style={{
              fontSize: 22,
              fontWeight: "bold",
              color: colors.primary,
              marginVertical: 20,
            }}
          >
            Your Lists
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
                      flex: 1,
                    }}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {list.title}
                  </Text>

                  <View style={{ flexDirection: "row", gap: 16 }}>
                    <Pressable
                      onPress={() =>
                        navigation.navigate("EditListScreen", { list })
                      }
                      style={{ padding: 4 }}
                    >
                      <MaterialIcons
                        name="edit"
                        size={22}
                        color={colors.primary}
                      />
                    </Pressable>

                    <Pressable
                      onPress={() => handleDeleteList(list.id)}
                      style={{ padding: 4 }}
                    >
                      <MaterialIcons name="delete" size={22} color="red" />
                    </Pressable>

                    <Pressable
                      onPress={() => handleCopyShareCode(list.shareId)}
                      style={{ padding: 4 }}
                    >
                      <MaterialIcons
                        name="share"
                        size={22}
                        color={colors.primary}
                      />
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
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  shareCodeContainer: {
    flexDirection: "row",
    marginBottom: 12,
  },
  shareCodeInput: {
    flex: 1,
    borderColor: colors.primary,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    height: 44,
    marginRight: 8,
  },
  shareCodeButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingHorizontal: 16,
    justifyContent: "center",
  },
  shareCodeButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default PreviousListScreen;
