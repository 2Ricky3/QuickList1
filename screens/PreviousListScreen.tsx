import React, { useState, useCallback, useRef } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Pressable,
  Alert,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  Animated,
  LayoutAnimation,
  UIManager,
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
import { colors, previousListStyles, spacing, typography, borderRadius, getTagColor } from "../GlobalStyleSheet";
import { MaterialIcons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { ModernLoader } from "../components/ModernLoader";
import { CardSkeleton } from "../components/SkeletonLoader";
import { EmptyState } from "../components/EmptyState";
import { ColorDisplay, getColorValue } from "../components/ColorDisplay";
import * as Haptics from "expo-haptics";

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

import { RootStackParamList } from "../types";
const PreviousListScreen = () => {
  const [lists, setLists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [shareCode, setShareCode] = useState("");
  const [loadingShared, setLoadingShared] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [searchText, setSearchText] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [expandedLists, setExpandedLists] = useState<Set<string>>(new Set());
  const shareCodeInputRef = useRef<TextInput>(null);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const toggleListExpansion = (listId: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    setExpandedLists((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(listId)) {
        newSet.delete(listId);
      } else {
        newSet.add(listId);
      }
      return newSet;
    });
  };

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
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await fetchLists();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchLists();
    }, [])
  );

  const handleDeleteList = async (listId: string) => {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
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
              await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
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

  const handleDeleteAllLists = async () => {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    Alert.alert(
      "Delete All Lists",
      `Are you sure you want to delete all ${lists.length} list(s)? This action cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete All",
          style: "destructive",
          onPress: async () => {
            try {
              await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
              
              // Delete all lists in parallel
              const deletePromises = lists.map(list => 
                deleteDoc(doc(db, "lists", list.id))
              );
              await Promise.all(deletePromises);
              
              await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              setLists([]);
              setAvailableTags([]);
              Alert.alert("Success", "All lists have been deleted.");
            } catch (error) {
              await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
              Alert.alert("Error", "Failed to delete all lists.");
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
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      Alert.alert("Error", "This list cannot be shared.");
      return;
    }
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      await Clipboard.setStringAsync(code);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert("Copied!", "Share code copied to clipboard.");
    } catch (e) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
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
        style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.white }}
      >
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
        style={{ flex: 1 }}
      >
        <View style={{ flex: 1 }}>
          <View style={previousListStyles.topSection}>
            <Text style={{ 
              ...typography.h2, 
              color: colors.primary, 
              marginBottom: spacing.lg,
              textAlign: "center" 
            }}>
              Open Shared List
            </Text>

            <View style={previousListStyles.shareCodeContainer}>
              <TextInput
                ref={shareCodeInputRef}
                style={[
                  previousListStyles.shareCodeInput,
                  focusedInput === 'shareCode' && { 
                    borderWidth: 2,
                    borderColor: colors.primary,
                    backgroundColor: colors.white
                  }
                ]}
                placeholder="Enter share code"
                placeholderTextColor={colors.textLight}
                value={shareCode}
                onChangeText={setShareCode}
                onFocus={() => setFocusedInput('shareCode')}
                onBlur={() => setFocusedInput(null)}
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
                { marginBottom: spacing.lg },
                focusedInput === 'search' && { 
                  borderWidth: 2,
                  borderColor: colors.primary,
                  backgroundColor: colors.white
                }
              ]}
              placeholder="Search lists..."
              placeholderTextColor={colors.textLight}
              value={searchText}
              onChangeText={setSearchText}
              onFocus={() => setFocusedInput('search')}
              onBlur={() => setFocusedInput(null)}
            />

            <Text style={{ 
              ...typography.h2, 
              color: colors.primary, 
              marginVertical: spacing.xl 
            }}>
              Your Lists
            </Text>

            
            {lists.length > 0 && (
              <Pressable
                onPress={handleDeleteAllLists}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  paddingVertical: spacing.md,
                  paddingHorizontal: spacing.lg,
                  backgroundColor: colors.white,
                  borderWidth: 2,
                  borderColor: colors.danger,
                  borderRadius: borderRadius.md,
                  marginBottom: spacing.lg,
                  minHeight: 48,
                }}
              >
                <MaterialIcons name="delete-forever" size={22} color={colors.danger} />
                <Text style={{ 
                  color: colors.danger, 
                  fontWeight: "600", 
                  fontSize: 15,
                  marginLeft: spacing.sm 
                }}>
                  Delete All Lists
                </Text>
              </Pressable>
            )}

            <View style={previousListStyles.tagsFilterContainer}>
              {availableTags.map((tag) => {
                const selected = selectedTags.includes(tag);
                return (
                  <Pressable
                    key={tag}
                    onPress={async () => {
                      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setSelectedTags((prev) =>
                        prev.includes(tag)
                          ? prev.filter((t) => t !== tag)
                          : [...prev, tag]
                      );
                    }}
                    style={[
                      previousListStyles.tagButton,
                      {
                        backgroundColor: selected ? colors.primary : "transparent",
                        borderColor: colors.primary,
                      }
                    ]}
                  >
                    <Text
                      style={[
                        previousListStyles.tagButtonText,
                        { 
                          color: selected ? colors.white : colors.primary,
                        }
                      ]}
                    >
                      {tag}
                    </Text>
                  </Pressable>
                );
              })}
              {selectedTags.length > 0 && (
                <Pressable
                  onPress={async () => {
                    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    setSelectedTags([]);
                  }}
                  style={{ 
                    justifyContent: "center", 
                    paddingHorizontal: spacing.md,
                    paddingVertical: spacing.xs,
                  }}
                >
                  <Text style={{ color: colors.danger, fontWeight: "600", fontSize: 13 }}>
                    Clear All
                  </Text>
                </Pressable>
              )}
            </View>
          </View>

          <ScrollView
            style={previousListStyles.listsScrollView}
            contentContainerStyle={{ paddingHorizontal: spacing.xl, paddingBottom: spacing.xl }}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={colors.primary}
                colors={[colors.primary]}
              />
            }
          >
            {searchedLists.length === 0 ? (
              <EmptyState
                icon="list-alt"
                title="No Lists Found"
                message="You haven't created any grocery lists yet. Start by creating your first one!"
                actionText="Create New List"
                onAction={() => navigation.navigate("CreateScreen")}
              />
            ) : (
              searchedLists.map((list) => {
                const listColor = getColorValue(list.color, colors.primary);
                const isExpanded = expandedLists.has(list.id);
                const hasMoreItems = (list.items?.length || 0) > 3;
                
                return (
                  <View
                    key={list.id}
                    style={[
                      previousListStyles.listCard,
                      { borderColor: colors.primary },
                    ]}
                  >
                    
                    <Pressable 
                      onPress={() => hasMoreItems && toggleListExpansion(list.id)}
                      style={{ flexDirection: "row", alignItems: "center", marginBottom: spacing.sm }}
                    >
                      <ColorDisplay
                        colorData={list.color}
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: 12,
                          marginRight: spacing.md,
                          borderWidth: 2,
                          borderColor: colors.border,
                        }}
                        fallbackColor={colors.primary}
                      />
                      <View style={{ flex: 1 }}>
                        <Text
                          style={[
                            previousListStyles.listTitle,
                            { color: colors.primary, marginBottom: 2 }, 
                          ]}
                          numberOfLines={1}
                          ellipsizeMode="tail"
                        >
                          {list.title}
                        </Text>
                        <Text style={{ color: colors.textLight, fontSize: 12 }}>
                          {list.items?.length || 0} item{list.items?.length !== 1 ? 's' : ''}
                        </Text>
                      </View>
                      {hasMoreItems && (
                        <MaterialIcons 
                          name={isExpanded ? "keyboard-arrow-up" : "keyboard-arrow-down"} 
                          size={24} 
                          color={colors.primary}
                        />
                      )}
                    </Pressable>

                   
                    <View style={{ 
                      marginBottom: spacing.md,
                    }}>
                      {isExpanded ? (
                        <View style={{ gap: spacing.xs }}>
                          {(list.items || []).map((item: string, index: number) => (
                            <View 
                              key={index}
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                                paddingVertical: spacing.xs,
                                paddingHorizontal: spacing.sm,
                                backgroundColor: colors.backgroundLight,
                                borderRadius: borderRadius.sm,
                              }}
                            >
                              <View style={{
                                width: 6,
                                height: 6,
                                borderRadius: 3,
                                backgroundColor: colors.primary,
                                marginRight: spacing.sm,
                              }} />
                              <Text style={{ 
                                fontSize: 14, 
                                color: colors.textDark,
                                flex: 1,
                              }}>
                                {item}
                              </Text>
                            </View>
                          ))}
                        </View>
                      ) : (
                        <Text style={{ 
                          fontSize: 14, 
                          color: colors.textMedium,
                          lineHeight: 20,
                        }}>
                          {list.items?.slice(0, 3).join(", ")}
                          {hasMoreItems ? "..." : ""}
                        </Text>
                      )}
                    </View>

                    
                    {list.tags && list.tags.length > 0 && (
                      <View style={previousListStyles.tagsContainer}>
                        {(list.tags || []).map((tag: string) => {
                          const tagColor = getTagColor(tag);
                          return (
                            <View 
                              key={tag} 
                              style={[
                                previousListStyles.tagBadge,
                                {
                                  backgroundColor: tagColor.bg,
                                  borderColor: tagColor.border,
                                }
                              ]}
                            >
                              <View style={[previousListStyles.tagColorDot, { backgroundColor: tagColor.border }]} />
                              <Text style={[previousListStyles.tagBadgeText, { color: tagColor.text }]}>
                                {tag}
                              </Text>
                            </View>
                          );
                        })}
                      </View>
                    )}

                   
                    <View style={{ 
                      flexDirection: "row", 
                      marginTop: spacing.lg, 
                      gap: spacing.md,
                    }}>
                      <Pressable
                        onPress={() => navigation.navigate("EditListScreen", { list })}
                        style={({ pressed }) => [
                          {
                            flex: 1,
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                            paddingVertical: spacing.md,
                            paddingHorizontal: spacing.lg,
                            backgroundColor: pressed ? colors.primary + '15' : colors.white,
                            borderWidth: 2,
                            borderColor: colors.primary,
                            borderRadius: borderRadius.md,
                            minHeight: 44,
                          }
                        ]}
                        accessibilityLabel="Edit List"
                      >
                        <MaterialIcons
                          name="edit"
                          size={20}
                          color={colors.primary}
                        />
                        <Text style={{ 
                          color: colors.primary, 
                          fontWeight: "600",
                          fontSize: 14,
                          marginLeft: spacing.xs,
                        }}>
                          Edit
                        </Text>
                      </Pressable>

                      <Pressable
                        onPress={() => handleCopyShareCode(list.shareId)}
                        style={({ pressed }) => [
                          {
                            flex: 1,
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                            paddingVertical: spacing.md,
                            paddingHorizontal: spacing.lg,
                            backgroundColor: pressed ? colors.primaryDark : colors.primary,
                            borderWidth: 2,
                            borderColor: colors.primary,
                            borderRadius: borderRadius.md,
                            minHeight: 44,
                          }
                        ]}
                        accessibilityLabel="Share List"
                      >
                        <MaterialIcons
                          name="share"
                          size={20}
                          color={colors.white}
                        />
                        <Text style={{ 
                          color: colors.white, 
                          fontWeight: "600",
                          fontSize: 14,
                          marginLeft: spacing.xs,
                        }}>
                          Share
                        </Text>
                      </Pressable>

                      <Pressable
                        onPress={() => handleDeleteList(list.id)}
                        style={({ pressed }) => [
                          {
                            paddingVertical: spacing.md,
                            paddingHorizontal: spacing.md,
                            backgroundColor: pressed ? colors.danger + '15' : 'transparent',
                            borderWidth: 2,
                            borderColor: colors.danger,
                            borderRadius: borderRadius.md,
                            minHeight: 44,
                            justifyContent: "center",
                            alignItems: "center",
                          }
                        ]}
                        accessibilityLabel="Delete List"
                      >
                        <MaterialIcons name="delete" size={20} color={colors.danger} />
                      </Pressable>
                    </View>
                  </View>
                );
              })
            )}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default PreviousListScreen;
