import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  Image,
  Animated,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import { colors, typography, spacing } from "../GlobalStyleSheet";
import { PrimaryButton } from "../components/PrimaryButton";
import { AnimatedPressable } from "../components/AnimatedPressable";
import * as Haptics from "expo-haptics";

type LandingScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "Landing">;

const LandingScreen = () => {
  const navigation = useNavigation<LandingScreenNavigationProp>();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const logoScaleAnim = useRef(new Animated.Value(0.8)).current;

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
    navigation.navigate("Terms");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />

      <View style={{ flex: 1, justifyContent: "space-between", paddingHorizontal: spacing.xl }}>
        {/* Logo and Welcome Section */}
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Animated.View
            style={{
              transform: [{ scale: logoScaleAnim }],
              opacity: fadeAnim,
              marginBottom: spacing.xxxl,
            }}
          >
            <Image
              source={require("../assets/Logo.png")}
              style={{
                width: 140,
                height: 140,
                resizeMode: "contain",
              }}
            />
          </Animated.View>

          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
              alignItems: "center",
            }}
          >
            <Text style={[typography.h1, { color: colors.textDark, marginBottom: spacing.md }]}>
              QuickList
            </Text>
            <Text
              style={[
                typography.body,
                {
                  color: colors.textLight,
                  textAlign: "center",
                  lineHeight: 24,
                },
              ]}
            >
              Create, share, and organize your lists with ease
            </Text>
          </Animated.View>
        </View>

        {/* Action Buttons Section */}
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
            gap: spacing.lg,
            marginBottom: spacing.xxxl,
          }}
        >
          <PrimaryButton
            title="Create Account"
            onPress={handleSignUp}
            icon="app-registration"
            size="large"
            fullWidth
          />

          <PrimaryButton
            title="Sign In"
            onPress={handleLogin}
            icon="login"
            size="large"
            fullWidth
            variant="secondary"
          />

          <AnimatedPressable
            onPress={handleTerms}
            style={{
              paddingVertical: spacing.lg,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: colors.textLight,
                fontSize: 13,
                textDecorationLine: "underline",
              }}
            >
              View Terms and Conditions
            </Text>
          </AnimatedPressable>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
};

export default LandingScreen;
