import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Alert,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons"; 
import { auth, db } from "../firebaseConfig";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  limit,
} from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import { colors, globalStyles } from "../GlobalStyleSheet";

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

  const fetchUserLists = async (userId: string) => {
    setStatsLoading(true);
    try {
      const q = query(
        collection(db, "lists"),
        where("uid", "==", userId),
        limit(15)
      );
      const querySnapshot = await getDocs(q);
      const lists: GroceryList[] = [];
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        lists.push({
          id: docSnap.id,
          createdAt: data.createdAt,
          items: data.items || [],
        });
      });
      setGroceryLists(lists);
    } catch (error) {
      console.warn("Failed to fetch grocery lists:", error);
    }
    setStatsLoading(false);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        }
      } else {
        navigation.navigate("Login");
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (auth.currentUser) {
        fetchUserLists(auth.currentUser.uid);
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

  if (loading) {
    return (
      <SafeAreaView style={globalStyles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <ScrollView contentContainerStyle={globalStyles.scrollContent}>
        <View style={globalStyles.headerContainer}>
          <Text style={globalStyles.greetingText}>
            {getGreeting()}, {userData?.displayName || "User"}!
          </Text>
          <Text style={globalStyles.dateText}>
            Today is {formatDate(new Date())}.
          </Text>
        </View>

        {/* Grocery Stats */}
        <View style={globalStyles.statsCard}>
          <Text style={globalStyles.statsTitle}>Your Grocery Stats</Text>
          {statsLoading ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : (
            <>
              <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 4 }}>
                <MaterialIcons name="shopping-cart" size={18} color={colors.primary} />
                <Text style={[globalStyles.statsText, { marginLeft: 8 }]}>
                  You have {groceryLists.length} past grocery{" "}
                  {groceryLists.length === 1 ? "list" : "lists"} saved.
                </Text>
              </View>

              <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 4 }}>
                <MaterialIcons name="calendar-today" size={18} color={colors.primary} />
                <Text style={[globalStyles.statsText, { marginLeft: 8 }]}>
                  Last grocery list: {getLastListDate()}
                </Text>
              </View>

              <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 4 }}>
                <MaterialIcons name="star" size={18} color={colors.primary} />
                <Text style={[globalStyles.statsText, { marginLeft: 8 }]}>
                  Frequently purchased: {getFrequentItems().join(", ")}
                </Text>
              </View>
            </>
          )}
        </View>

        <Text style={globalStyles.optionsText}>What would you like to do?</Text>

        <View style={globalStyles.optionsContainer}>
          {/* Previous Buys */}
          <Pressable
            style={globalStyles.previousBuysButton}
            onPress={() => navigation.navigate("PreviousListScreen")}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <MaterialIcons name="shopping-cart" size={24} color={colors.primary} />
              <Text style={[globalStyles.previousBuysTitle, { marginLeft: 8 }]}>Previous Buys</Text>
            </View>
            <Text style={globalStyles.previousBuysSubtitle}>
              View your past grocery lists and reorder quickly.
            </Text>
          </Pressable>

          {/* New Grocery List */}
          <Pressable
            style={globalStyles.newListButton}
            onPress={() => navigation.navigate("CreateScreen")}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <MaterialIcons name="note" size={24} color={colors.primary} />
              <Text style={[globalStyles.newListTitle, { marginLeft: 8 }]}>New Grocery List</Text>
            </View>
            <Text style={globalStyles.newListSubtitle}>
              Start a fresh grocery list from scratch.
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
