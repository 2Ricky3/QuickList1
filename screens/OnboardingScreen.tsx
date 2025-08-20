import React, { useState } from "react";
import { View, Text, SafeAreaView, Pressable, Image } from "react-native";
import { useNavigation, RouteProp, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import { globalStyles, onboardingStyles, colors } from "../GlobalStyleSheet";
import AsyncStorage from "@react-native-async-storage/async-storage";

const steps = [
  {
    title: "Create Lists",
    description: "Easily make shopping or to-do lists in seconds.",
    image: require("../assets/Logo.png"),
  },
  {
    title: "Share with Others",
    description: "Share your lists with friends or family using a code.",
    image: require("../assets/Logo.png"),
  },
  {
    title: "See Previous Lists",
    description: "Quickly access and reuse your previous lists anytime.",
    image: require("../assets/Logo.png"),
  },
];

const OnboardingScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, "Onboarding">>();
  const userId = route.params?.userId;

  const [step, setStep] = useState(0);

  const handleNext = async () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      if (userId) {
        await AsyncStorage.setItem(`onboardingSeen:${userId}`, "true");
      }
      navigation.replace("Home");
    }
  };

  const handleSkip = async () => {
    if (userId) {
      await AsyncStorage.setItem(`onboardingSeen:${userId}`, "true");
    }
    navigation.replace("Home");
  };

  return (
    <SafeAreaView style={globalStyles.container}>
      <View style={onboardingStyles.skipContainer}>
        {step < steps.length - 1 && (
          <Pressable onPress={handleSkip}>
            <Text style={onboardingStyles.skipText}>Skip</Text>
          </Pressable>
        )}
      </View>

      <View style={onboardingStyles.contentWrapper}>
        <View style={onboardingStyles.card}>
          <Image source={steps[step].image} style={onboardingStyles.image} />
          <Text style={onboardingStyles.title}>{steps[step].title}</Text>
          <Text style={onboardingStyles.description}>
            {steps[step].description}
          </Text>
        </View>
      </View>
      <View style={onboardingStyles.dots}>
        {steps.map((_, i) => (
          <View
            key={i}
            style={[
              onboardingStyles.dot,
              { backgroundColor: i === step ? colors.primary : "#eee" },
            ]}
          />
        ))}
      </View>
      <Pressable style={globalStyles.buttonContainer} onPress={handleNext}>
        <Text style={globalStyles.buttonText}>
          {step === steps.length - 1 ? "Get Started" : "Next"}
        </Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default OnboardingScreen;
