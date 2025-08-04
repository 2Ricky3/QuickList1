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
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";

const HomeScreen = () => {
  const navigation = useNavigation();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#C20200" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        {/* Header */}
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <Text style={{ fontSize: 22, fontWeight: "bold", color: "#C20200" }}>
            Welcome, {userData?.displayName || "User"}!
          </Text>
        </View>

        <Text style={{ fontSize: 16, color: "#333", marginBottom: 16 }}>
          What would you like to do?
        </Text>

        {/* Feature Cards */}
        <View style={{ gap: 20 }}>
          {/* Previous Buys Card */}
          <Pressable
            style={{
              backgroundColor: "#fff",
              borderRadius: 16,
              padding: 20,
              borderWidth: 1,
              borderColor: "#C20200",
              shadowColor: "#000",
              shadowOpacity: 0.08,
              shadowRadius: 4,
              elevation: 3,
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "bold", color: "#C20200", marginBottom: 8 }}>
              🛒 Previous Buys
            </Text>
            <Text style={{ color: "#555", fontSize: 14 }}>
              View your past grocery lists and reorder quickly.
            </Text>
          </Pressable>

          {/* Create New List Card */}
          <Pressable
            style={{
              backgroundColor: "#C20200",
              borderRadius: 16,
              padding: 20,
              shadowColor: "#000",
              shadowOpacity: 0.08,
              shadowRadius: 4,
              elevation: 3,
            }}
            onPress={() => navigation.navigate("CreateScreen")}
          >
            <Text style={{ fontSize: 18, fontWeight: "bold", color: "#fff", marginBottom: 8 }}>
              📝 New Grocery List
            </Text>
            <Text style={{ color: "#f3f3f3", fontSize: 14 }}>
              Start a fresh grocery list from scratch.
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
