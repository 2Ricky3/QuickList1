import React, { useEffect, useRef } from "react";
import { View, Animated, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { RootStackParamList } from "../types";

type SplashScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "Splash">;

const SplashScreen = () => {
  const navigation = useNavigation<SplashScreenNavigationProp>();
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const heartbeat = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.22, duration: 100, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1.0, duration: 140, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1.13, duration: 90, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1.0, duration: 140, useNativeDriver: true }),
        Animated.delay(820),
      ])
    );
    heartbeat.start();

    // Wait for Firebase to restore the persisted session, then route accordingly
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // Minimum 2s splash so the animation is visible
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 2000 - elapsed);
      setTimeout(() => {
        heartbeat.stop();
        if (user) {
          navigation.replace("Home");
        } else {
          navigation.replace("Landing");
        }
      }, remaining);
      unsubscribe(); // only act on the first resolution
    });

    const startTime = Date.now();

    return () => {
      heartbeat.stop();
      unsubscribe();
    };
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require("../assets/Logo.png")}
        style={[styles.logo, { transform: [{ scale: pulseAnim }] }]}
        resizeMode="contain"
      />
      <Text style={styles.title}>Quicklist</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 140,
    height: 140,
    marginBottom: 24,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#C20200",
    letterSpacing: 1.5,
  },
});

export default SplashScreen;
