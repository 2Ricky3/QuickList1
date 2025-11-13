import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Pressable,
  Alert,
  StyleSheet,
  Animated,
  Modal,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { auth, db } from "../firebaseConfig";
import {
  doc,
  getDoc,
} from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigation, useFocusEffect, CommonActions } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import { colors, globalStyles, spacing, borderRadius, elevation, typography } from "../GlobalStyleSheet";
import { fetchUserLists } from "../services/listService";
import { getAchievements, Achievement } from "../services/achievementService";
import { ModernLoader } from "../components/ModernLoader";
import { AnimatedPressable } from "../components/AnimatedPressable";
import * as Haptics from "expo-haptics";
import { logFirestoreError, errorLogger } from "../services/errorLogger";
type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Home"
>;
interface GroceryList {
  id: string;
  createdAt: any;
  items: string[];
}
const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [groceryLists, setGroceryLists] = useState<GroceryList[]>([]);
  const [statsLoading, setStatsLoading] = useState(false);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [achievementsLoading, setAchievementsLoading] = useState(false);
  const [showAchievementsModal, setShowAchievementsModal] = useState(false);
  const modalAnim = useRef(new Animated.Value(0)).current;
  const modalOverlayAnim = useRef(new Animated.Value(0)).current;
  const greetingAnim = useRef(new Animated.Value(0)).current;
  const statsAnim = useRef(new Animated.Value(0)).current;
  const achievementsAnim = useRef(new Animated.Value(0)).current;
  const actionsHeaderAnim = useRef(new Animated.Value(0)).current;
  const action1Anim = useRef(new Animated.Value(0)).current;
  const action2Anim = useRef(new Animated.Value(0)).current;
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };
  const formatDate = (date: Date) => {
    return date.toLocaleDateString(undefined, {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  };
  const fetchUserListsAndSet = async (userId: string) => {
    setStatsLoading(true);
    try {
      const lists = await fetchUserLists(userId, 15);
      setGroceryLists(lists);
    } catch (error) {
      logFirestoreError(error, 'Fetch user lists for stats', 'lists');
    }
    setStatsLoading(false);
  };
  const fetchUserAchievements = async (userId: string) => {
    setAchievementsLoading(true);
    try {
      const userAchievements = await getAchievements(userId);
      setAchievements(userAchievements);
    } catch (error) {
      logFirestoreError(error, 'Fetch user achievements', 'achievements');
    }
    setAchievementsLoading(false);
  };
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        errorLogger.setUserContext(user.uid, user.email || undefined);
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        }
      } else {
        errorLogger.clearUserContext();
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: "Login" }],
          })
        );
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);
  useEffect(() => {
    if (!loading) {
      Animated.stagger(100, [
        Animated.spring(greetingAnim, {
          toValue: 1,
          tension: 300,
          friction: 20,
          useNativeDriver: true,
        }),
        Animated.spring(statsAnim, {
          toValue: 1,
          tension: 300,
          friction: 20,
          useNativeDriver: true,
        }),
        Animated.spring(achievementsAnim, {
          toValue: 1,
          tension: 300,
          friction: 20,
          useNativeDriver: true,
        }),
        Animated.spring(actionsHeaderAnim, {
          toValue: 1,
          tension: 300,
          friction: 20,
          useNativeDriver: true,
        }),
        Animated.spring(action1Anim, {
          toValue: 1,
          tension: 300,
          friction: 20,
          useNativeDriver: true,
        }),
        Animated.spring(action2Anim, {
          toValue: 1,
          tension: 300,
          friction: 20,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [loading]);
  useFocusEffect(
    useCallback(() => {
      if (auth.currentUser) {
        fetchUserListsAndSet(auth.currentUser.uid);
        fetchUserAchievements(auth.currentUser.uid);
      }
    }, [])
  );
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.navigate("Login");
    } catch (error) {
      Alert.alert("Error", "Could not log out. Try again.");
    }
  };
  const getLastListDate = () => {
    if (groceryLists.length === 0) return "No lists yet";
    const lastDate = groceryLists[0].createdAt?.toDate
      ? groceryLists[0].createdAt.toDate()
      : groceryLists[0].createdAt;
    return formatDate(new Date(lastDate));
  };
  const getFrequentItems = () => {
    const freqMap: Record<string, number> = {};
    groceryLists.forEach((list) => {
      list.items.forEach((item) => {
        const name = item.toLowerCase();
        freqMap[name] = (freqMap[name] || 0) + 1;
      });
    });
    const sortedItems = Object.entries(freqMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([name]) => name);
    if (sortedItems.length === 0) return ["None yet"];
    return sortedItems;
  };
  const openAchievementsModal = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setShowAchievementsModal(true);
    Animated.parallel([
      Animated.timing(modalOverlayAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.spring(modalAnim, {
        toValue: 1,
        tension: 100,
        friction: 10,
        useNativeDriver: true,
      }),
    ]).start();
  };
  const closeAchievementsModal = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.parallel([
      Animated.timing(modalOverlayAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(modalAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowAchievementsModal(false);
    });
  };
  if (loading) {
    return (
      <SafeAreaView style={globalStyles.loadingContainer}>
        <ModernLoader size="large" />
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView style={globalStyles.container}>
      <ScrollView
        contentContainerStyle={globalStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={{
            marginBottom: spacing.xl,
            opacity: greetingAnim,
            transform: [{
              translateY: greetingAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0],
              }),
            }],
          }}
        >
          <Text style={[typography.h1, { color: colors.primary, marginBottom: spacing.xs }]}>
            {getGreeting()}, {userData?.displayName || "User"}!
          </Text>
          <Text style={[typography.h3, { color: colors.textMedium, fontWeight: "400" }]}>
            {formatDate(new Date())}
          </Text>
        </Animated.View>
        <Animated.View
          style={[
            styles.card,
            { marginBottom: spacing.lg },
            {
              opacity: statsAnim,
              transform: [{
                translateY: statsAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0],
                }),
              }],
            }
          ]}
        >
          <Text style={[typography.h2, { marginBottom: spacing.lg }]}>Your Stats</Text>
          {statsLoading ? (
            <ModernLoader size="small" />
          ) : (
            <View style={{ gap: spacing.md }}>
              <View style={styles.statBadge}>
                <View style={[styles.statIconContainer, { backgroundColor: '#FFE5E5' }]}>
                  <MaterialIcons name="shopping-cart" size={24} color={colors.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.statValue}>{groceryLists.length}</Text>
                  <Text style={styles.statLabel}>
                    Grocery {groceryLists.length === 1 ? "List" : "Lists"} Saved
                  </Text>
                </View>
              </View>
              <View style={styles.statBadge}>
                <View style={[styles.statIconContainer, { backgroundColor: '#FFF3E0' }]}>
                  <MaterialIcons name="calendar-today" size={24} color="#FF9800" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.statValue}>{getLastListDate()}</Text>
                  <Text style={styles.statLabel}>Last Grocery List</Text>
                </View>
              </View>
              <View style={styles.statBadge}>
                <View style={[styles.statIconContainer, { backgroundColor: '#E8F5E9' }]}>
                  <MaterialIcons name="star" size={24} color="#4CAF50" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.statValue} numberOfLines={1}>
                    {getFrequentItems().join(", ") || "None yet"}
                  </Text>
                  <Text style={styles.statLabel}>Frequently Purchased</Text>
                </View>
              </View>
            </View>
          )}
        </Animated.View>
        <Animated.View
          style={[
            styles.card,
            { marginBottom: spacing.lg },
            {
              opacity: achievementsAnim,
              transform: [{
                translateY: achievementsAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0],
                }),
              }],
            }
          ]}
        >
          {achievementsLoading ? (
            <ModernLoader size="small" />
          ) : (
            <Pressable
              onPress={openAchievementsModal}
              style={({ pressed }) => ({
                opacity: pressed ? 0.7 : 1,
              })}
            >
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
                  <MaterialIcons name="emoji-events" size={24} color={colors.primary} />
                  <View style={{ marginLeft: spacing.md, flex: 1 }}>
                    <Text style={[typography.h3, { marginBottom: spacing.xs, fontSize: 16 }]}>
                      Achievements
                    </Text>
                    <Text style={{ fontSize: 13, color: colors.textMedium }}>
                      {achievements.filter(a => a.unlocked).length} of {achievements.length} unlocked
                    </Text>
                  </View>
                </View>
                <View style={{ alignItems: "center" }}>
                  <Text style={{
                    fontSize: 24,
                    fontWeight: "700",
                    color: colors.primary,
                  }}>
                    {achievements.filter(a => a.unlocked).length}/{achievements.length}
                  </Text>
                  <MaterialIcons name="chevron-right" size={20} color={colors.textMedium} />
                </View>
              </View>
            </Pressable>
          )}
        </Animated.View>
        <Animated.View
          style={{
            opacity: actionsHeaderAnim,
            transform: [{
              translateY: actionsHeaderAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0],
              }),
            }],
          }}
        >
          <Text style={[typography.h3, { marginBottom: spacing.md, color: colors.textDark }]}>
            What would you like to do?
          </Text>
        </Animated.View>
        <Animated.View
          style={{
            opacity: action1Anim,
            transform: [{
              translateY: action1Anim.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0],
              }),
            }],
          }}
        >
          <AnimatedPressable
            style={[
              styles.actionCard,
              { marginBottom: spacing.md, backgroundColor: colors.primary },
            ]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              navigation.navigate("CreateScreen");
            }}
          >
            <View style={[styles.actionIconContainer, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
              <MaterialIcons name="note" size={32} color={colors.white} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[typography.h3, { color: colors.white }]}>New Grocery List</Text>
              <Text style={[typography.body, { color: 'rgba(255,255,255,0.9)', fontSize: 14 }]}>
                Start a fresh grocery list from scratch
              </Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="rgba(255,255,255,0.7)" />
          </AnimatedPressable>
        </Animated.View>
        <Animated.View
          style={{
            opacity: action2Anim,
            transform: [{
              translateY: action2Anim.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0],
              }),
            }],
          }}
        >
          <AnimatedPressable
            style={[
              styles.actionCard,
              { marginBottom: spacing.md },
            ]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              navigation.navigate("PreviousListScreen");
            }}
          >
            <View style={styles.actionIconContainer}>
              <MaterialIcons name="history" size={32} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={typography.h3}>Previous Buys</Text>
              <Text style={[typography.body, { color: colors.textMedium, fontSize: 14 }]}>
                View your past grocery lists and reorder quickly
              </Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={colors.textMedium} />
          </AnimatedPressable>
        </Animated.View>
        <AnimatedPressable
          style={{
            marginTop: spacing.xxxl,
            marginBottom: spacing.xl,
            paddingVertical: spacing.md,
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            gap: spacing.sm,
          }}
          onPress={handleLogout}
        >
          <MaterialIcons name="logout" size={20} color={colors.textMedium} />
          <Text style={[typography.body, { color: colors.textMedium }]}>
            Logout
          </Text>
        </AnimatedPressable>
      </ScrollView>
      <Modal
        visible={showAchievementsModal}
        transparent
        animationType="none"
        onRequestClose={closeAchievementsModal}
      >
        <Animated.View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            opacity: modalOverlayAnim,
          }}
        >
          <Pressable
            style={{ flex: 1 }}
            onPress={closeAchievementsModal}
          />
        </Animated.View>
        <Animated.View
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            maxHeight: '85%',
            backgroundColor: colors.white,
            borderTopLeftRadius: borderRadius.xl,
            borderTopRightRadius: borderRadius.xl,
            ...elevation.lg,
            transform: [{
              translateY: modalAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [600, 0],
              }),
            }],
          }}
        >
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: spacing.lg,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
              <MaterialIcons name="emoji-events" size={28} color={colors.primary} />
              <Text style={[typography.h2, { marginBottom: 0 }]}>
                All Achievements
              </Text>
            </View>
            <Pressable
              onPress={closeAchievementsModal}
              hitSlop={10}
            >
              <MaterialIcons name="close" size={28} color={colors.textMedium} />
            </Pressable>
          </View>
          <View style={{
            padding: spacing.lg,
            backgroundColor: `${colors.primary}08`,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
          }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
              <View style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 28, fontWeight: '700', color: colors.primary }}>
                  {achievements.filter(a => a.unlocked).length}
                </Text>
                <Text style={{ fontSize: 13, color: colors.textMedium, marginTop: 4 }}>
                  Unlocked
                </Text>
              </View>
              <View style={{ width: 1, backgroundColor: colors.border }} />
              <View style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 28, fontWeight: '700', color: colors.textDark }}>
                  {achievements.length - achievements.filter(a => a.unlocked).length}
                </Text>
                <Text style={{ fontSize: 13, color: colors.textMedium, marginTop: 4 }}>
                  Locked
                </Text>
              </View>
              <View style={{ width: 1, backgroundColor: colors.border }} />
              <View style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 28, fontWeight: '700', color: colors.primary }}>
                  {Math.round((achievements.filter(a => a.unlocked).length / achievements.length) * 100)}%
                </Text>
                <Text style={{ fontSize: 13, color: colors.textMedium, marginTop: 4 }}>
                  Complete
                </Text>
              </View>
            </View>
          </View>
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ padding: spacing.lg, gap: spacing.md }}
            showsVerticalScrollIndicator={false}
          >
            {achievements
              .sort((a, b) => {
                if (a.unlocked && !b.unlocked) return -1;
                if (!a.unlocked && b.unlocked) return 1;
                return b.progress - a.progress;
              })
              .map((achievement) => {
                const progressPercent = Math.min((achievement.progress / achievement.target) * 100, 100);
                const isUnlocked = achievement.unlocked;
                return (
                  <View
                    key={achievement.id}
                    style={{
                      padding: spacing.lg,
                      backgroundColor: isUnlocked ? `${colors.primary}10` : colors.backgroundLight,
                      borderRadius: borderRadius.lg,
                      borderWidth: isUnlocked ? 2 : 1,
                      borderColor: isUnlocked ? colors.primary : colors.border,
                      ...elevation.sm,
                    }}
                  >
                    <View style={{ flexDirection: "row", alignItems: "center", marginBottom: spacing.sm }}>
                      <View style={{
                        width: 44,
                        height: 44,
                        borderRadius: borderRadius.round,
                        backgroundColor: isUnlocked ? colors.primary : colors.border,
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: spacing.md,
                      }}>
                        <MaterialIcons
                          name={achievement.icon as any}
                          size={24}
                          color={colors.white}
                        />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={{
                          fontSize: 16,
                          fontWeight: "700",
                          color: isUnlocked ? colors.primary : colors.textDark,
                        }}>
                          {achievement.title}
                        </Text>
                        <Text style={{
                          fontSize: 13,
                          color: colors.textMedium,
                          marginTop: 2,
                        }}>
                          {achievement.description}
                        </Text>
                      </View>
                      {isUnlocked && (
                        <Text style={{ fontSize: 24, marginLeft: spacing.sm }}>🏆</Text>
                      )}
                    </View>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      <View style={{
                        flex: 1,
                        height: 8,
                        backgroundColor: colors.border,
                        borderRadius: 4,
                        overflow: "hidden",
                        marginRight: spacing.md,
                      }}>
                        <View style={{
                          width: `${progressPercent}%`,
                          height: "100%",
                          backgroundColor: isUnlocked ? colors.primary : "#FFB300",
                          borderRadius: 4,
                        }} />
                      </View>
                      <Text style={{
                        fontSize: 13,
                        fontWeight: "700",
                        color: isUnlocked ? colors.primary : colors.textMedium,
                        minWidth: 50,
                      }}>
                        {achievement.progress}/{achievement.target}
                      </Text>
                    </View>
                  </View>
                );
              })}
          </ScrollView>
        </Animated.View>
      </Modal>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...elevation.md,
  },
  statBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.round,
    alignItems: "center",
    justifyContent: "center",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.textDark,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 13,
    color: colors.textMedium,
  },
  actionCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    ...elevation.sm,
  },
  actionIconContainer: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.lg,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.backgroundLight,
  },
});
export default HomeScreen;
