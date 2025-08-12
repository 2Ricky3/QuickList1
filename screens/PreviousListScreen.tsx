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
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
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

      const tagsSet = new Set<string>();
      fetchedLists.forEach((list) => {
        (list.tags || []).forEach((tag: string) => tagsSet.add(tag));
      });
      setAvailableTags(Array.from(tagsSet));
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

  const filteredLists =
    selectedTags.length === 0
      ? lists
      : lists.filter(
          (list) =>
            list.tags && selectedTags.every((tag) => list.tags.includes(tag))
        );

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
        <View style={{ flex: 1 }}>
          {/* Fixed Top Section */}
          <View style={styles.topSection}>
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

            {/* Tags Filter */}
            <View style={styles.tagsFilterContainer}>
              {availableTags.map((tag) => {
                const selected = selectedTags.includes(tag);
                return (
                  <Pressable
                    key={tag}
                    onPress={() => {
                      setSelectedTags((prev) =>
                        prev.includes(tag)
                          ? prev.filter((t) => t !== tag)
                          : [...prev, tag]
                      );
                    }}
                    style={[
                      styles.tagButton,
                      selected && styles.tagButtonSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.tagButtonText,
                        selected && styles.tagButtonTextSelected,
                      ]}
                    >
                      {tag}
                    </Text>
                  </Pressable>
                );
              })}
              {selectedTags.length > 0 && (
                <Pressable
                  onPress={() => setSelectedTags([])}
                  style={{ justifyContent: "center", marginLeft: 8 }}
                >
                  <Text style={{ color: "red", fontWeight: "bold" }}>
                    Clear Filters
                  </Text>
                </Pressable>
              )}
            </View>
          </View>

          {/* Scrollable Lists Section */}
          <ScrollView
            style={styles.listsScrollView}
            contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
          >
            {filteredLists.length === 0 ? (
              <Text style={{ color: "#999", fontSize: 16 }}>
                No lists found.
              </Text>
            ) : (
              filteredLists.map((list) => (
                <View key={list.id} style={styles.listCard}>
                  <View style={styles.listCardHeader}>
                    <Text
                      style={styles.listTitle}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {list.title}
                    </Text>

                    <View style={styles.listCardButtons}>
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

                  {/* List Items */}
                  <Text style={{ marginTop: 8, fontSize: 14, color: "#555" }}>
                    {list.items?.join(", ")}
                  </Text>

                  {/* Tags Display */}
                  <View style={styles.tagsContainer}>
                    {(list.tags || []).map((tag: string) => (
                      <View key={tag} style={styles.tagBadge}>
                        <Text style={styles.tagBadgeText}>{tag}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              ))
            )}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  topSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: "#fff",
    flexShrink: 0,
  },
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
  tagsFilterContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  tagButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: "transparent",
    marginRight: 8,
    marginBottom: 8,
  },
  tagButtonSelected: {
    backgroundColor: colors.primary,
  },
  tagButtonText: {
    color: colors.primary,
  },
  tagButtonTextSelected: {
    color: "#fff",
  },
  listsScrollView: {
    flex: 1,
  },
  listCard: {
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
  },
  listCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  listTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.primary,
    flex: 1,
  },
  listCardButtons: {
    flexDirection: "row",
    gap: 16,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
  },
  tagBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4,
  },
  tagBadgeText: {
    color: "#fff",
    fontSize: 12,
  },
});

export default PreviousListScreen;
