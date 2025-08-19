import React, { useState, useCallback, useRef } from "react";
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
import { useNavigation, useFocusEffect, NavigationProp } from "@react-navigation/native";
import { auth, db } from "../firebaseConfig";
import { colors, previousListStyles } from "../GlobalStyleSheet";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import * as Clipboard from "expo-clipboard";

import { RootStackParamList } from "../types";
const PreviousListScreen = () => {
  const [lists, setLists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [shareCode, setShareCode] = useState("");
  const [loadingShared, setLoadingShared] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [searchText, setSearchText] = useState("");
  const shareCodeInputRef = useRef<TextInput>(null);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

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

  const searchedLists = searchText
    ? filteredLists.filter((list) =>
        list.title.toLowerCase().includes(searchText.toLowerCase())
      )
    : filteredLists;

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
          <View style={previousListStyles.topSection}>
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

            <View style={previousListStyles.shareCodeContainer}>
              <TextInput
                ref={shareCodeInputRef}
                style={previousListStyles.shareCodeInput}
                placeholder="Enter share code"
                value={shareCode}
                onChangeText={setShareCode}
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loadingShared}
                returnKeyType="done"
              />
              <Pressable
                style={[
                  previousListStyles.shareCodeButton,
                  { opacity: shareCode.trim() ? 1 : 0.5 },
                ]}
                onPress={handleFetchSharedList}
                disabled={loadingShared || !shareCode.trim()}
              >
                <Text style={previousListStyles.shareCodeButtonText}>
                  {loadingShared ? "Loading..." : "Open"}
                </Text>
              </Pressable>
            </View>
            <TextInput
              style={[
                previousListStyles.shareCodeInput,
                { marginBottom: 12, marginRight: 0 },
              ]}
              placeholder="Search lists..."
              value={searchText}
              onChangeText={setSearchText}
            />

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

            <View style={previousListStyles.tagsFilterContainer}>
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
                      previousListStyles.tagButton,
                      selected && previousListStyles.tagButtonSelected,
                    ]}
                  >
                    <Text
                      style={[
                        previousListStyles.tagButtonText,
                        selected && previousListStyles.tagButtonTextSelected,
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

          <ScrollView
            style={previousListStyles.listsScrollView}
            contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
          >
            {searchedLists.length === 0 ? (
              <View style={{ alignItems: "center", marginTop: 40 }}>
                <MaterialIcons name="list-alt" size={48} color="#ccc" />
                <Text style={{ color: "#999", fontSize: 16, marginTop: 12 }}>
                  No lists found. Try creating a new one!
                </Text>
              </View>
            ) : (
              searchedLists.map((list) => (
                <View
                  key={list.id}
                  style={[
                    previousListStyles.listCard,
                    { borderColor: list.color || colors.primary },
                  ]}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <View
                      style={{
                        width: 18,
                        height: 18,
                        borderRadius: 9,
                        backgroundColor: list.color || colors.primary,
                        marginRight: 10,
                        borderWidth: 1,
                        borderColor: "#ccc",
                      }}
                    />
                    <Text
                      style={[
                        previousListStyles.listTitle,
                        { color: list.color || colors.primary }, 
                      ]}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {list.title}
                    </Text>
                    <Text style={{ color: "#999", fontSize: 12, marginLeft: 8 }}>
                      {list.items?.length || 0} items
                    </Text>
                  </View>
                  <Text style={{ marginTop: 4, fontSize: 14, color: "#555" }}>
                    {list.items?.slice(0, 3).join(", ")}
                    {list.items?.length > 3 ? "..." : ""}
                  </Text>
                  <View style={previousListStyles.tagsContainer}>
                    {(list.tags || []).map((tag: string) => (
                      <View key={tag} style={previousListStyles.tagBadge}>
                        <Text style={previousListStyles.tagBadgeText}>{tag}</Text>
                      </View>
                    ))}
                  </View>
                  <View style={{ flexDirection: "row", justifyContent: "flex-end", marginTop: 12 }}>
                    <Pressable
                      onPress={() => navigation.navigate("EditListScreen", { list })}
                      style={{ alignItems: "center", marginRight: 24 }}
                      accessibilityLabel="Edit List"
                    >
                      <MaterialIcons
                        name="edit"
                        size={22}
                        color={list.color || colors.primary}
                      />
                      <Text style={{ fontSize: 10, color: colors.primary }}>Edit</Text>
                    </Pressable>
                    <Pressable
                      onPress={() => handleDeleteList(list.id)}
                      style={{ alignItems: "center", marginRight: 24 }}
                      accessibilityLabel="Delete List"
                    >
                      <MaterialIcons name="delete" size={22} color="red" />
                      <Text style={{ fontSize: 10, color: "red" }}>Delete</Text>
                    </Pressable>
                    <Pressable
                      onPress={() => handleCopyShareCode(list.shareId)}
                      style={{ alignItems: "center" }}
                      accessibilityLabel="Share List"
                    >
                      <MaterialIcons
                        name="share"
                        size={22}
                        color={list.color || colors.primary}
                      />
                      <Text style={{ fontSize: 10, color: colors.primary }}>Share</Text>
                    </Pressable>
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

export default PreviousListScreen;
