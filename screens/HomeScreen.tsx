import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Alert,
} from "react-native";
import { auth, db } from "../firebaseConfig";
import { doc, getDoc, collection, query, where, getDocs, orderBy, limit } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types"; 
import { colors } from "../GlobalStyleSheet";

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Home"
>;

interface GroceryList {
  id: string;
  createdAt: any; 
  items: { name: string; quantity?: number }[];
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
    console.log("Fetching lists for user:", userId);
    const q = query(
      collection(db, "Lists"),
      where("uid", "==", userId),
      limit(15)
    );
    const querySnapshot = await getDocs(q);
    console.log("Query snapshot size:", querySnapshot.size);

    const lists: GroceryList[] = [];
    querySnapshot.forEach((doc) => {
      console.log("Doc data:", doc.id, doc.data());
      const data = doc.data();
      lists.push({
        id: doc.id,
        createdAt: data.createdAt,
        items: data.items || [],
      });
    });
    setGroceryLists(lists);
    console.log("Lists set in state:", lists.length);
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
        } else {
          console.warn("User data not found.");
        }
        fetchUserLists(user.uid);
      } else {
        navigation.navigate("Login");
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

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
        const name = item.name.toLowerCase();
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
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <View style={{ marginBottom: 12 }}>
          <Text style={{ fontSize: 24, fontWeight: "bold", color: colors.primary }}>
            {getGreeting()}, {userData?.displayName || "User"}!
          </Text>
          <Text style={{ fontSize: 16, color: "#555", marginTop: 4 }}>
            Today is {formatDate(new Date())}.
          </Text>
        </View>

        <View
          style={{
            marginBottom: 24,
            padding: 20,
            borderRadius: 20,
            backgroundColor: "#f9f9f9",
            shadowColor: "#000",
            shadowOpacity: 0.05,
            shadowRadius: 4,
            elevation: 2,
          }}
        >
          <Text style={{ fontWeight: "600", fontSize: 18, marginBottom: 8 }}>
            Your Grocery Stats
          </Text>
          {statsLoading ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : (
            <>
              <Text style={{ fontSize: 14, color: "#555", marginBottom: 4 }}>
                🛒 You have {groceryLists.length} past grocery{" "}
                {groceryLists.length === 1 ? "list" : "lists"} saved.
              </Text>
              <Text style={{ fontSize: 14, color: "#555", marginBottom: 4 }}>
                📅 Last grocery list: {getLastListDate()}
              </Text>
              <Text style={{ fontSize: 14, color: "#555" }}>
                ⭐ Frequently purchased: {getFrequentItems().join(", ")}
              </Text>
            </>
          )}
        </View>

        <Text style={{ fontSize: 16, color: "#333", marginBottom: 16 }}>
          What would you like to do?
        </Text>

        <View style={{ gap: 20 }}>
          {/* 🛒 Previous Buys */}
          <Pressable
            style={{
              backgroundColor: colors.white,
              borderRadius: 20,
              padding: 28,
              borderWidth: 1,
              borderColor: colors.primary,
              shadowColor: "#000",
              shadowOpacity: 0.08,
              shadowRadius: 4,
              elevation: 3,
            }}
            onPress={() => navigation.navigate("PreviousListScreen")}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                color: colors.primary,
                marginBottom: 8,
              }}
            >
              🛒 Previous Buys
            </Text>
            <Text style={{ color: "#555", fontSize: 16 }}>
              View your past grocery lists and reorder quickly.
            </Text>
          </Pressable>

          {/* 📝 New Grocery List */}
          <Pressable
            style={{
              backgroundColor: colors.primary,
              borderRadius: 20,
              padding: 28,
              shadowColor: "#000",
              shadowOpacity: 0.08,
              shadowRadius: 4,
              elevation: 3,
            }}
            onPress={() => navigation.navigate("CreateScreen")}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                color: colors.white,
                marginBottom: 8,
              }}
            >
              📝 New Grocery List
            </Text>
            <Text style={{ color: "#f3f3f3", fontSize: 16 }}>
              Start a fresh grocery list from scratch.
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
