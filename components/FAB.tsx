import React from "react";
import { Pressable, StyleSheet, Animated } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { colors, spacing, elevation } from "../GlobalStyleSheet";
import * as Haptics from "expo-haptics";
interface FABProps {
  onPress: () => void;
  icon?: keyof typeof MaterialIcons.glyphMap;
  disabled?: boolean;
  loading?: boolean;
}
export const FAB: React.FC<FABProps> = ({
  onPress,
  icon = "check",
  disabled = false,
  loading = false
}) => {
  const scaleValue = new Animated.Value(1);
  const handlePressIn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.spring(scaleValue, {
      toValue: 0.9,
      speed: 50,
      bounciness: 4,
      useNativeDriver: true,
    }).start();
  };
  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      speed: 50,
      bounciness: 4,
      useNativeDriver: true,
    }).start();
  };
  const handlePress = () => {
    if (!disabled && !loading) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onPress();
    }
  };
  return (
    <Animated.View
      style={[
        styles.fabContainer,
        { transform: [{ scale: scaleValue }] },
        (disabled || loading) && styles.fabDisabled,
      ]}
    >
      <Pressable
        style={styles.fab}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
      >
        <MaterialIcons
          name={loading ? "hourglass-empty" : icon}
          size={28}
          color={colors.white}
        />
      </Pressable>
    </Animated.View>
  );
};
const styles = StyleSheet.create({
  fabContainer: {
    position: "absolute",
    bottom: 100,
    right: spacing.lg,
    zIndex: 1000,
  },
  fab: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    ...elevation.lg,
    shadowColor: colors.shadowColor,
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 12,
  },
  fabDisabled: {
    opacity: 0.5,
  },
});
