import React from "react";
import { SafeAreaView, ScrollView, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { globalStyles, colors, spacing, typography } from "../GlobalStyleSheet";
import { AnimatedPressable } from "../components/AnimatedPressable";
const TermsScreen = () => {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
      <ScrollView contentContainerStyle={[globalStyles.scrollContent, { paddingTop: spacing.xxl }]}>
        <Text style={globalStyles.titleText}>Terms and Conditions</Text>
        <Text style={{
          ...typography.body,
          color: colors.textDark,
          lineHeight: 24,
          marginBottom: spacing.xxl
        }}>
          This app is a personal project developed by a single developer to make shopping and sharing shopping lists easier.
          {"\n\n"}
          The app is provided as-is, without any warranties or guarantees. By using this app, you acknowledge that it is intended for personal use and convenience only.
          {"\n\n"}
          No personal data is sold or shared with third parties. Please use the app responsibly.
        </Text>
        <AnimatedPressable
          style={globalStyles.buttonContainer}
          onPress={() => navigation.goBack()}
        >
          <Text style={globalStyles.buttonText}>Back</Text>
        </AnimatedPressable>
      </ScrollView>
    </SafeAreaView>
  );
};
export default TermsScreen;
