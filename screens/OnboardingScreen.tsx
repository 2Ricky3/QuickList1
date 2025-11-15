import React, { useState, useRef, useEffect } from "react";
import { View, Text, SafeAreaView, Image, Animated } from "react-native";
import { useNavigation, RouteProp, useRoute, CommonActions } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import { globalStyles, onboardingStyles, colors } from "../GlobalStyleSheet";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AnimatedPressable } from "../components/AnimatedPressable";
import { MaterialIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";

const steps = [
  {
    title: "Create Lists Instantly",
    description: "Build your grocery and shopping lists in seconds with smart suggestions and easy organization.",
    icon: "add-shopping-cart" as const,
    gradient: [colors.primary, colors.primaryLight] as [string, string],
  },
  {
    title: "Share Effortlessly",
    description: "Collaborate with family and friends by sharing lists using simple 6-character codes.",
    icon: "share" as const,
    gradient: ["#E63946", "#FF6B6B"] as [string, string],
  },
  {
    title: "Track Your History",
    description: "Access all your previous lists, reuse items, and manage everything in one place.",
    icon: "history" as const,
    gradient: ["#C20200", "#520600"] as [string, string],
  },
];
const OnboardingScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, "Onboarding">>();
  const userId = route.params?.userId;
  const [step, setStep] = useState(0);
  
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const iconRotateAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.spring(fadeAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(iconRotateAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, [step]);
  
  const handleNext = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    if (step < steps.length - 1) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: -50,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.9,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setStep(step + 1);
        slideAnim.setValue(50);
        fadeAnim.setValue(0);
        scaleAnim.setValue(0.9);
        iconRotateAnim.setValue(0);
      });
    } else {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      if (userId) {
        await AsyncStorage.setItem(`onboardingSeen:${userId}`, "true");
      }
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "Home" }],
        })
      );
    }
  };
  
  const handleSkip = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (userId) {
      await AsyncStorage.setItem(`onboardingSeen:${userId}`, "true");
    }
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "Home" }],
      })
    );
  };
  
  const iconRotation = iconRotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  return (
    <SafeAreaView style={[globalStyles.container, { backgroundColor: colors.white }]}>
      <View style={onboardingStyles.header}>
        <Image 
          source={require("../assets/Logo.png")} 
          style={onboardingStyles.headerLogo}
        />
        {step < steps.length - 1 && (
          <AnimatedPressable onPress={handleSkip} style={onboardingStyles.skipButton}>
            <Text style={onboardingStyles.skipText}>Skip</Text>
            <MaterialIcons name="arrow-forward" size={18} color={colors.primary} />
          </AnimatedPressable>
        )}
      </View>

      <View style={onboardingStyles.contentWrapper}>
        <Animated.View 
          style={[
            onboardingStyles.card,
            {
              opacity: fadeAnim,
              transform: [
                { translateY: slideAnim },
                { scale: scaleAnim },
              ],
            },
          ]}
        >
          <View style={onboardingStyles.iconContainer}>
            <LinearGradient
              colors={steps[step].gradient}
              style={onboardingStyles.iconGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Animated.View style={{ transform: [{ rotate: iconRotation }] }}>
                <MaterialIcons 
                  name={steps[step].icon} 
                  size={64} 
                  color={colors.white} 
                />
              </Animated.View>
            </LinearGradient>
          </View>

          <Text style={onboardingStyles.title}>{steps[step].title}</Text>
          <Text style={onboardingStyles.description}>
            {steps[step].description}
          </Text>
        </Animated.View>
      </View>

      <View style={onboardingStyles.dotsContainer}>
        {steps.map((_, i) => (
          <Animated.View
            key={i}
            style={[
              onboardingStyles.dot,
              {
                backgroundColor: i === step ? colors.primary : colors.border,
                transform: [{
                  scale: i === step ? 1.2 : 1,
                }],
              },
            ]}
          />
        ))}
      </View>

      <View style={onboardingStyles.bottomSection}>
        <View style={onboardingStyles.progressContainer}>
          <Text style={onboardingStyles.progressText}>
            {step + 1} of {steps.length}
          </Text>
          <View style={onboardingStyles.progressBar}>
            <Animated.View 
              style={[
                onboardingStyles.progressFill,
                { width: `${((step + 1) / steps.length) * 100}%` },
              ]}
            />
          </View>
        </View>
        
        <AnimatedPressable 
          style={onboardingStyles.nextButton} 
          onPress={handleNext}
        >
          <Text style={onboardingStyles.nextButtonText}>
            {step === steps.length - 1 ? "Get Started" : "Next"}
          </Text>
          <MaterialIcons 
            name={step === steps.length - 1 ? "check" : "arrow-forward"} 
            size={22} 
            color={colors.white} 
          />
        </AnimatedPressable>
      </View>
    </SafeAreaView>
  );
};
export default OnboardingScreen;
