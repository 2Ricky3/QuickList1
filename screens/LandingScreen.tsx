import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  Animated,
  StatusBar,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { RootStackParamList } from "../types";
import { colors } from "../GlobalStyleSheet";
import { AnimatedPressable } from "../components/AnimatedPressable";
import TermsModal from "./TermsScreen";
import * as Haptics from "expo-haptics";

type LandingScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "Landing">;

const LandingScreen = () => {
  const navigation = useNavigation<LandingScreenNavigationProp>();
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const logoScaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    checkTermsAcceptance();
  }, []);

  const checkTermsAcceptance = async () => {
    try {
      const accepted = await AsyncStorage.getItem("termsAccepted");
      const isAccepted = accepted === "true";
      setTermsAccepted(isAccepted);
      
      // Show terms modal if not accepted
      if (!isAccepted) {
        setShowTermsModal(true);
      }
    } catch (error) {
      console.error("Error checking terms acceptance:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.spring(logoScaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleLogin = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate("Login");
  };

  const handleSignUp = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate("Register");
  };

  const handleTerms = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowTermsModal(true);
  };

  const handleAcceptTerms = async () => {
    try {
      await AsyncStorage.setItem("termsAccepted", "true");
      setTermsAccepted(true);
      setShowTermsModal(false);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error("Error saving terms acceptance:", error);
    }
  };

  if (loading) {
    return (
      <LinearGradient
        colors={["#FFFFFF", "#FFF0F0", "#FFE8E8"]}
        style={styles.loadingContainer}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={["#FFFFFF", "#FFF4F4", "#FFE8E8"]}
      style={styles.gradientBg}
    >
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

        <View style={styles.content}>
          {/* Hero Section */}
          <Animated.View
            style={[
              styles.heroSection,
              {
                opacity: fadeAnim,
                transform: [{ scale: logoScaleAnim }],
              },
            ]}
          >
            {/* Decorative glow ring */}
            <View style={styles.logoGlowOuter}>
              <View style={styles.logoGlowInner}>
                <Image
                  source={require("../assets/Logo.png")}
                  style={styles.logo}
                />
              </View>
            </View>

            <Text style={styles.title}>QuickList</Text>
            <Text style={styles.tagline}>Smart Shopping, Simplified</Text>
          </Animated.View>

          {/* Action Buttons Section */}
          <Animated.View
            style={[
              styles.buttonSection,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            {/* Sign Up — primary pill button */}
            <AnimatedPressable
              onPress={handleSignUp}
              disabled={!termsAccepted}
              style={[styles.buttonWrapper, !termsAccepted && styles.buttonDisabled]}
            >
              <LinearGradient
                colors={["#D40000", "#FF3030"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.primaryButton}
              >
                <Text style={styles.primaryButtonText}>Create Account</Text>
              </LinearGradient>
            </AnimatedPressable>

            {/* Sign In — soft glass button */}
            <AnimatedPressable
              onPress={handleLogin}
              disabled={!termsAccepted}
              style={[styles.buttonWrapper, !termsAccepted && styles.buttonDisabled]}
            >
              <View style={styles.secondaryButton}>
                <Text style={styles.secondaryButtonText}>Sign In</Text>
              </View>
            </AnimatedPressable>

            {/* Terms link */}
            <AnimatedPressable
              onPress={handleTerms}
              style={styles.termsButton}
            >
              <Text style={styles.termsText}>
                By continuing you agree to our{" "}
                <Text style={styles.termsLink}>Terms & Conditions</Text>
              </Text>
            </AnimatedPressable>
          </Animated.View>
        </View>

        <TermsModal
          visible={showTermsModal}
          onClose={() => {
            if (termsAccepted) {
              setShowTermsModal(false);
            }
          }}
          onAccept={handleAcceptTerms}
          requireAccept={!termsAccepted}
        />
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientBg: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    paddingHorizontal: 28,
    justifyContent: "space-between",
    paddingTop: 20,
    paddingBottom: 12,
  },

  /* ── Hero ── */
  heroSection: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    gap: 12,
  },
  logoGlowOuter: {
    width: 210,
    height: 210,
    borderRadius: 105,
    backgroundColor: "rgba(194,2,0,0.06)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 48,
    elevation: 0,
  },
  logoGlowInner: {
    width: 176,
    height: 176,
    borderRadius: 88,
    backgroundColor: "rgba(194,2,0,0.08)",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 144,
    height: 144,
    resizeMode: "contain",
  },
  title: {
    fontSize: 44,
    fontWeight: "800" as const,
    color: "#1A1A1A",
    letterSpacing: -1.5,
    textAlign: "center",
  },
  tagline: {
    fontSize: 16,
    fontWeight: "400" as const,
    color: colors.textMedium,
    textAlign: "center",
    letterSpacing: 0.15,
  },

  /* ── Buttons ── */
  buttonSection: {
    gap: 12,
    paddingBottom: 8,
  },
  buttonWrapper: {
    borderRadius: 999,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  primaryButton: {
    borderRadius: 999,
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: {
    fontSize: 17,
    fontWeight: "700" as const,
    color: "#FFFFFF",
    letterSpacing: 0.3,
  },
  secondaryButton: {
    borderRadius: 999,
    paddingVertical: 17,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.9)",
    borderWidth: 1.5,
    borderColor: "rgba(194,2,0,0.2)",
  },
  secondaryButtonText: {
    fontSize: 17,
    fontWeight: "600" as const,
    color: colors.primary,
    letterSpacing: 0.3,
  },
  termsButton: {
    paddingVertical: 10,
    alignItems: "center",
  },
  termsText: {
    fontSize: 12.5,
    color: colors.textLight,
    textAlign: "center",
    lineHeight: 18,
  },
  termsLink: {
    color: colors.primary,
    fontWeight: "600" as const,
  },
});

export default LandingScreen;
