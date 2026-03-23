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
import { RootStackParamList } from "../types";
import { colors, typography, spacing } from "../GlobalStyleSheet";
import { PrimaryButton } from "../components/PrimaryButton";
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
      <SafeAreaView style={styles.container}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />

      <View style={styles.content}>
        {/* Header Section */}
        <Animated.View
          style={[
            styles.headerSection,
            {
              opacity: fadeAnim,
              transform: [{ scale: logoScaleAnim }],
            },
          ]}
        >
          <Image
            source={require("../assets/Logo.png")}
            style={styles.logo}
          />
          <Text style={styles.title}>QuickList</Text>
          <Text style={styles.subtitle}>Smart Shopping, Simplified</Text>
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
          <PrimaryButton
            title="Sign Up"
            onPress={handleSignUp}
            icon="person-add"
            size="large"
            fullWidth
            variant="primary"
            disabled={!termsAccepted}
          />

          <PrimaryButton
            title="Sign In"
            onPress={handleLogin}
            icon="login"
            size="large"
            fullWidth
            variant="secondary"
            disabled={!termsAccepted}
          />

          <AnimatedPressable
            onPress={handleTerms}
            style={styles.termsButton}
          >
            <Text style={styles.termsText}>Terms and Conditions</Text>
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    justifyContent: "space-between",
  },
  headerSection: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: spacing.xxxl,
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: "contain",
    marginBottom: spacing.xxl,
  },
  title: {
    ...typography.h1,
    color: colors.primary,
    marginBottom: spacing.md,
    letterSpacing: 0.5,
  },
  subtitle: {
    ...typography.body,
    color: colors.textMedium,
    textAlign: "center",
    lineHeight: 22,
    fontWeight: "400",
  },

  buttonSection: {
    gap: spacing.xs,
    marginBottom: spacing.lg,
  },
  termsButton: {
    paddingVertical: spacing.lg,
    alignItems: "center",
  },
  termsText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "500",
    textDecorationLine: "underline",
  },
});

export default LandingScreen;
