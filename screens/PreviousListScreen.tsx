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
import { useNavigation, useFocusEffect, NavigationProp } from "@react-navigation/native";
import { auth, db } from "../firebaseConfig";
import { colors, previousListStyles, spacing, typography, borderRadius, getTagColor, elevation } from "../GlobalStyleSheet";
import { MaterialIcons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { ModernLoader } from "../components/ModernLoader";
import { CardSkeleton } from "../components/SkeletonLoader";
import { EmptyState } from "../components/EmptyState";
import { ColorDisplay, getColorValue } from "../components/ColorDisplay";
import { logFirestoreError } from "../services/errorLogger";
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
  const [showFilters, setShowFilters] = useState(false);
  const [pressedCard, setPressedCard] = useState<string | null>(null);
  const filterAnimation = useRef(new Animated.Value(0)).current;
  const cardAnimations = useRef<Map<string, Animated.Value>>(new Map()).current;
  const cardScaleAnimations = useRef<Map<string, Animated.Value>>(new Map()).current;
  const shareCodeInputRef = useRef<TextInput>(null);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const formatDate = (timestamp: any) => {
    if (!timestamp) return "Recently";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };
  const getCardAnimation = (listId: string) => {
    if (!cardAnimations.has(listId)) {
      cardAnimations.set(listId, new Animated.Value(0));
    }
    return cardAnimations.get(listId)!;
  };
  const getCardScaleAnimation = (listId: string) => {
    if (!cardScaleAnimations.has(listId)) {
      cardScaleAnimations.set(listId, new Animated.Value(1));
    }
    return cardScaleAnimations.get(listId)!;
  };
  const animateCardEntrance = (listId: string) => {
    const animation = getCardAnimation(listId);
    Animated.spring(animation, {
      toValue: 1,
      useNativeDriver: true,
      tension: 50,
      friction: 7,
    }).start();
  };
  const toggleFilters = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const toValue = showFilters ? 0 : 1;
    setShowFilters(!showFilters);
    Animated.spring(filterAnimation, {
      toValue,
      useNativeDriver: false,
      tension: 80,
      friction: 10,
    }).start();
  };
  const toggleListExpansion = (listId: string) => {
    LayoutAnimation.configureNext({
      duration: 300,
      create: { type: 'easeInEaseOut', property: 'opacity' },
      update: { type: 'spring', springDamping: 0.7 },
      delete: { type: 'easeInEaseOut', property: 'opacity' },
    });
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
        animateCardEntrance(list.id);
      });
      setAvailableTags(Array.from(tagsSet));
    } catch (error) {
      logFirestoreError(error, 'Fetch user lists', 'lists');
      Alert.alert("Error", "Failed to load lists.");
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
              logFirestoreError(error, 'Delete list', 'lists');
              Alert.alert("Error", "Failed to delete list.");
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
              const deletePromises = lists.map(list =>
                deleteDoc(doc(db, "lists", list.id))
              );
              await Promise.all(deletePromises);
              await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              setLists([]);
              setAvailableTags([]);
              Alert.alert("Success", "All lists have been deleted.");
            } catch (error) {
              logFirestoreError(error, 'Delete all lists', 'lists');
              await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
              Alert.alert("Error", "Failed to delete all lists.");
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
      logFirestoreError(error, 'Fetch shared list', 'lists');
      Alert.alert("Error", "Failed to fetch shared list.");
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
      logFirestoreError(e, 'Copy share code', 'clipboard');
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Error", "Failed to copy share code.");
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
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingHorizontal: spacing.md, paddingTop: spacing.lg, paddingBottom: spacing.xl }}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={colors.primary}
                colors={[colors.primary]}
              />
            }
          >
            <Text style={[typography.h1, { color: colors.primary, marginBottom: spacing.xl }]}>
              Previous Lists
            </Text>
            <View style={[styles.card, { marginBottom: spacing.lg }]}>
              <View style={{ flexDirection: "row", alignItems: "center", marginBottom: spacing.md }}>
                <MaterialIcons name="share" size={24} color={colors.primary} style={{ marginRight: spacing.sm }} />
                <Text style={typography.h3}>Open Shared List</Text>
              </View>
              <View style={{ flexDirection: "row", gap: spacing.sm, marginBottom: spacing.sm }}>
                <TextInput
                  ref={shareCodeInputRef}
                  style={[
                    styles.input,
                    { flex: 1 },
                    focusedInput === 'shareCode' && styles.inputFocused
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
                    styles.openButton,
                    { opacity: shareCode.trim() ? 1 : 0.5 },
                  ]}
                  onPress={handleFetchSharedList}
                  disabled={loadingShared || !shareCode.trim()}
                >
                  <Text style={styles.openButtonText}>
                    {loadingShared ? "..." : "Open"}
                  </Text>
                </Pressable>
              </View>
            </View>
            <View style={[styles.searchContainer, focusedInput === 'search' && styles.searchContainerFocused, { marginBottom: spacing.lg }]}>
              <MaterialIcons name="search" size={24} color={focusedInput === 'search' ? colors.primary : colors.textMedium} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search your lists..."
                placeholderTextColor={colors.textLight}
                value={searchText}
                onChangeText={setSearchText}
                onFocus={() => setFocusedInput('search')}
                onBlur={() => setFocusedInput(null)}
              />
              {searchText.length > 0 && (
                <Pressable onPress={() => setSearchText("")}>
                  <MaterialIcons name="close" size={20} color={colors.textMedium} />
                </Pressable>
              )}
              <View style={styles.filterDivider} />
              <Pressable
                onPress={toggleFilters}
                style={({ pressed }) => [
                  styles.filterButton,
                  pressed && { opacity: 0.6 },
                  (selectedTags.length > 0 || showFilters) && { backgroundColor: colors.primary + '15' }
                ]}
              >
                <MaterialIcons
                  name="filter-list"
                  size={24}
                  color={(selectedTags.length > 0 || showFilters) ? colors.primary : colors.textMedium}
                />
                {selectedTags.length > 0 && (
                  <View style={styles.filterBadge}>
                    <Text style={styles.filterBadgeText}>{selectedTags.length}</Text>
                  </View>
                )}
              </Pressable>
            </View>
            {showFilters && (
              <Animated.View
                style={[
                  styles.card,
                  {
                    marginBottom: spacing.lg,
                    opacity: filterAnimation,
                    transform: [{
                      translateY: filterAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-20, 0],
                      })
                    }],
                    scaleY: filterAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.95, 1],
                    }),
                  }
                ]}
              >
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: spacing.md }}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <MaterialIcons name="local-offer" size={20} color={colors.primary} style={{ marginRight: spacing.sm }} />
                    <Text style={[typography.h3, { fontSize: 16 }]}>Filter by Tags</Text>
                  </View>
                  {selectedTags.length > 0 && (
                    <Pressable
                      onPress={async () => {
                        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                        setSelectedTags([]);
                      }}
                    >
                      <Text style={{ color: colors.danger, fontWeight: "600", fontSize: 13 }}>
                        Clear All
                      </Text>
                    </Pressable>
                  )}
                </View>
                {availableTags.length > 0 ? (
                  <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.sm }}>
                    {availableTags.map((tag) => {
                      const selected = selectedTags.includes(tag);
                      const tagColor = getTagColor(tag);
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
                              backgroundColor: selected ? tagColor.bg : `${tagColor.bg}30`,
                              borderColor: selected ? tagColor.border : `${tagColor.border}70`,
                              borderWidth: selected ? 2 : 1.5,
                              shadowColor: selected ? tagColor.border : 'transparent',
                              shadowOffset: { width: 0, height: 2 },
                              shadowOpacity: selected ? 0.25 : 0,
                              shadowRadius: 3,
                              elevation: selected ? 2 : 0,
                            }
                          ]}
                        >
                          <View style={{
                            width: 7,
                            height: 7,
                            borderRadius: 3.5,
                            backgroundColor: selected ? tagColor.border : tagColor.text,
                            marginRight: 5,
                          }} />
                          <Text
                            style={[
                              previousListStyles.tagButtonText,
                              {
                                color: selected ? tagColor.text : tagColor.border,
                                fontWeight: selected ? "700" : "600",
                              }
                            ]}
                          >
                            {tag}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                ) : (
                  <Text style={{ color: colors.textMedium, fontSize: 14, fontStyle: "italic" }}>
                    No tags available. Create lists with tags to filter them here.
                  </Text>
                )}
              </Animated.View>
            )}
            {lists.length > 0 && (
              <Pressable
                onPress={handleDeleteAllLists}
                style={({ pressed }) => [
                  styles.deleteAllButton,
                  pressed && { opacity: 0.7 }
                ]}
              >
                <MaterialIcons name="delete-forever" size={22} color={colors.danger} />
                <Text style={styles.deleteAllButtonText}>
                  Delete All Lists
                </Text>
              </Pressable>
            )}
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
                const cardAnimation = getCardAnimation(list.id);
                const scaleAnim = getCardScaleAnimation(list.id);
                const handlePressIn = () => {
                  setPressedCard(list.id);
                  Animated.spring(scaleAnim, {
                    toValue: 0.98,
                    useNativeDriver: true,
                    tension: 300,
                    friction: 20,
                  }).start();
                };
                const handlePressOut = () => {
                  setPressedCard(null);
                  Animated.spring(scaleAnim, {
                    toValue: 1,
                    useNativeDriver: true,
                    tension: 300,
                    friction: 20,
                  }).start();
                };
                return (
                  <Animated.View
                    key={list.id}
                    style={[
                      styles.listCard,
                      pressedCard === list.id && styles.listCardPressed,
                      {
                        opacity: cardAnimation,
                        transform: [
                          {
                            translateX: cardAnimation.interpolate({
                              inputRange: [0, 1],
                              outputRange: [50, 0],
                            }),
                          },
                          {
                            scale: Animated.multiply(
                              cardAnimation.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0.95, 1],
                              }),
                              scaleAnim
                            ),
                          },
                        ],
                      },
                    ]}
                  >
                    <View style={[styles.colorAccent, { backgroundColor: listColor }]} />
                    <View style={styles.cardContent}>
                      <View style={{ flexDirection: "row", marginBottom: spacing.md }}>
                        <Pressable
                          onPress={() => hasMoreItems && toggleListExpansion(list.id)}
                          onPressIn={handlePressIn}
                          onPressOut={handlePressOut}
                          style={{ flexDirection: "row", alignItems: "flex-start", flex: 1 }}
                        >
                          <ColorDisplay
                            colorData={list.color}
                            style={styles.colorIndicator}
                            fallbackColor={colors.primary}
                          />
                          <View style={{ flex: 1 }}>
                            <Text style={[typography.h3, { color: colors.textDark, marginBottom: spacing.xs }]} numberOfLines={1}>
                              {list.title}
                            </Text>
                            <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
                              <Text style={styles.metadata}>
                                {list.items?.length || 0} item{list.items?.length !== 1 ? 's' : ''}
                              </Text>
                              {list.createdAt && (
                                <>
                                  <Text style={styles.metadataDot}>Ã¢â‚¬Â¢</Text>
                                  <Text style={styles.metadata}>
                                    {formatDate(list.createdAt)}
                                  </Text>
                                </>
                              )}
                            </View>
                          </View>
                          {hasMoreItems && (
                            <Animated.View
                              style={{
                                transform: [{
                                  rotate: isExpanded ? '180deg' : '0deg'
                                }]
                              }}
                            >
                              <MaterialIcons
                                name="keyboard-arrow-down"
                                size={24}
                                color={colors.primary}
                              />
                            </Animated.View>
                          )}
                        </Pressable>
                        {list.tags && list.tags.length > 0 && (
                          <View style={styles.tagsTopRight}>
                            {list.tags.slice(0, 2).map((tag: string, tagIndex: number) => {
                              const tagColor = getTagColor(tag);
                              return (
                                <View
                                  key={tag}
                                  style={[
                                    styles.compactTagBadge,
                                    {
                                      backgroundColor: tagColor.bg,
                                      borderColor: tagColor.border,
                                      shadowColor: tagColor.border,
                                      shadowOffset: { width: 0, height: 1 },
                                      shadowOpacity: 0.3,
                                      shadowRadius: 2,
                                      elevation: 2,
                                    }
                                  ]}
                                >
                                  <View style={{
                                    width: 6,
                                    height: 6,
                                    borderRadius: 3,
                                    backgroundColor: tagColor.border,
                                    marginRight: 4,
                                  }} />
                                  <Text style={[styles.compactTagText, { color: tagColor.text }]}>
                                    {tag}
                                  </Text>
                                </View>
                              );
                            })}
                            {list.tags.length > 2 && (
                              <View style={[
                                styles.compactTagBadge,
                                {
                                  backgroundColor: `${colors.primary}10`,
                                  borderColor: `${colors.primary}40`,
                                }
                              ]}>
                                <Text style={[styles.compactTagText, { color: colors.primary, fontWeight: "700" }]}>
                                  +{list.tags.length - 2}
                                </Text>
                              </View>
                            )}
                          </View>
                        )}
                      </View>
                    <View style={{
                      marginBottom: spacing.md,
                    }}>
                      {isExpanded ? (
                        <View style={{ gap: spacing.xs }}>
                          {(list.items || []).map((item: string, index: number) => (
                            <View
                              key={index}
                              style={styles.expandedItem}
                            >
                              <View style={[styles.itemBullet, { backgroundColor: listColor }]} />
                              <Text style={styles.itemText}>
                                {item}
                              </Text>
                            </View>
                          ))}
                        </View>
                      ) : (
                        <View style={styles.previewContainer}>
                          <Text style={styles.previewText} numberOfLines={2}>
                            {list.items?.slice(0, 3).join(" Ã¢â‚¬Â¢ ")}
                            {hasMoreItems ? "..." : ""}
                          </Text>
                        </View>
                      )}
                    </View>
                    <View style={styles.actionButtonsContainer}>
                      <Pressable
                        onPress={() => navigation.navigate("EditListScreen", { list })}
                        style={({ pressed }) => [
                          styles.actionButton,
                          styles.actionButtonOutline,
                          pressed && { backgroundColor: colors.primary + '15' },
                        ]}
                        accessibilityLabel="Edit List"
                      >
                        <MaterialIcons name="edit" size={18} color={colors.primary} />
                        <Text style={[styles.actionButtonText, { color: colors.primary }]}>
                          Edit
                        </Text>
                      </Pressable>
                      <Pressable
                        onPress={() => handleCopyShareCode(list.shareId)}
                        style={({ pressed }) => [
                          styles.actionButton,
                          styles.actionButtonPrimary,
                          pressed && { backgroundColor: colors.primaryDark },
                        ]}
                        accessibilityLabel="Share List"
                      >
                        <MaterialIcons name="share" size={18} color={colors.white} />
                        <Text style={[styles.actionButtonText, { color: colors.white }]}>
                          Share
                        </Text>
                      </Pressable>
                      <Pressable
                        onPress={() => handleDeleteList(list.id)}
                        style={({ pressed }) => [
                          styles.actionButtonIcon,
                          pressed && { backgroundColor: colors.danger + '15' },
                        ]}
                        accessibilityLabel="Delete List"
                      >
                        <MaterialIcons name="delete" size={20} color={colors.danger} />
                      </Pressable>
                    </View>
                    </View>
                  </Animated.View>
                );
              })
            )}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...elevation.sm,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderWidth: 2,
    borderColor: colors.border,
    gap: spacing.sm,
    ...elevation.sm,
    minHeight: 56,
  },
  searchContainerFocused: {
    borderColor: colors.primary,
    ...elevation.md,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: 15,
    color: colors.textDark,
    backgroundColor: colors.white,
    minHeight: 48,
  },
  inputFocused: {
    borderWidth: 2,
    borderColor: colors.primary,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.textDark,
    paddingVertical: 0,
  },
  filterDivider: {
    width: 1,
    height: 28,
    backgroundColor: colors.border,
    marginHorizontal: spacing.xs,
  },
  filterButton: {
    padding: spacing.xs,
    borderRadius: borderRadius.md,
    position: "relative",
  },
  filterBadge: {
    position: "absolute",
    top: 2,
    right: 2,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.round,
    minWidth: 18,
    height: 18,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  filterBadgeText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: "700",
  },
  openButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    minHeight: 48,
    justifyContent: "center",
    alignItems: "center",
    minWidth: 80,
  },
  openButtonText: {
    color: colors.white,
    fontWeight: "600",
    fontSize: 15,
  },
  deleteAllButton: {
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
    ...elevation.sm,
  },
  deleteAllButtonText: {
    color: colors.danger,
    fontWeight: "600",
    fontSize: 15,
    marginLeft: spacing.sm,
  },
  listCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
    ...elevation.md,
    overflow: "hidden",
    position: "relative",
  },
  listCardPressed: {
    ...elevation.sm,
  },
  colorAccent: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 5,
  },
  cardContent: {
    padding: spacing.lg,
    paddingLeft: spacing.xl,
  },
  colorIndicator: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: spacing.md,
    borderWidth: 3,
    borderColor: colors.white,
    ...elevation.sm,
  },
  metadata: {
    fontSize: 13,
    color: colors.textMedium,
  },
  metadataDot: {
    fontSize: 13,
    color: colors.textLight,
  },
  tagsTopRight: {
    flexDirection: "row",
    gap: spacing.xs,
    marginLeft: spacing.sm,
  },
  compactTagBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
  },
  compactTagText: {
    fontSize: 11,
    fontWeight: "600",
  },
  expandedItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.backgroundLight,
    borderRadius: borderRadius.md,
  },
  itemBullet: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    marginRight: spacing.sm,
  },
  itemText: {
    fontSize: 15,
    color: colors.textDark,
    flex: 1,
  },
  previewContainer: {
    paddingVertical: spacing.xs,
  },
  previewText: {
    fontSize: 15,
    color: colors.textMedium,
    lineHeight: 22,
  },
  actionButtonsContainer: {
    flexDirection: "row",
    marginTop: spacing.md,
    gap: spacing.sm,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border + '40',
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    minHeight: 42,
    gap: spacing.xs,
  },
  actionButtonOutline: {
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  actionButtonPrimary: {
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  actionButtonIcon: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    minHeight: 42,
    minWidth: 42,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: colors.danger,
    backgroundColor: colors.white,
  },
  actionButtonText: {
    fontWeight: "600",
    fontSize: 14,
  },
});
export default PreviousListScreen;
