import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import { colors, spacing, borderRadius, typography } from "../GlobalStyleSheet";
import { AnimatedPressable } from "./AnimatedPressable";
import { HapticType } from "../utils/haptics";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger"
  | "dangerOutline"
  | "success";

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  icon?: string;
  variant?: ButtonVariant;
  size?: "small" | "medium" | "large";
  fullWidth?: boolean;
  haptic?: HapticType;
  style?: any;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  icon,
  variant = "primary",
  size = "medium",
  fullWidth = true,
  haptic,
  style,
}) => {
  const isDisabled = disabled || loading;
  const variantConfig = variantStyles[variant];
  const sizeConfig = sizeStyles[size];
  // Strong CTAs get a medium press, lightweight buttons a light tap
  const defaultHaptic: HapticType =
    variant === "primary" || variant === "danger" || variant === "success"
      ? "press"
      : "tap";

  const content = (
    <View style={styles.content}>
      {icon && !loading && (
        <MaterialIcons
          name={icon as any}
          size={sizeConfig.iconSize}
          color={variantConfig.textColor}
          style={styles.icon}
        />
      )}
      <Text
        style={[
          typography.button,
          styles.text,
          { color: variantConfig.textColor },
          sizeConfig.text,
        ]}
      >
        {loading ? "Loading..." : title}
      </Text>
    </View>
  );

  return (
    <AnimatedPressable
      onPress={onPress}
      disabled={isDisabled}
      haptic={isDisabled ? "none" : haptic ?? defaultHaptic}
      style={[
        styles.container,
        fullWidth && styles.fullWidth,
        { borderRadius: sizeConfig.container.borderRadius },
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {variant === "primary" ? (
        <LinearGradient
          colors={[variantConfig.colors[0], variantConfig.colors[1]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.fill, sizeConfig.container]}
        >
          {content}
        </LinearGradient>
      ) : (
        <View
          style={[
            styles.fill,
            { backgroundColor: variantConfig.colors[0] },
            variantConfig.borderColor != null && {
              borderWidth: 1.5,
              borderColor: variantConfig.borderColor,
            },
            sizeConfig.container,
          ]}
        >
          {content}
        </View>
      )}
    </AnimatedPressable>
  );
};

const variantStyles: Record<
  ButtonVariant,
  { colors: [string, string]; textColor: string; borderColor?: string }
> = {
  primary: {
    colors: [colors.primary, colors.primaryLight],
    textColor: colors.white,
  },
  secondary: {
    colors: [colors.backgroundLight, colors.backgroundLight],
    textColor: colors.textDark,
  },
  outline: {
    colors: ["transparent", "transparent"],
    textColor: colors.primary,
    borderColor: colors.primary,
  },
  ghost: {
    colors: ["transparent", "transparent"],
    textColor: colors.textMedium,
  },
  danger: {
    colors: [colors.danger, colors.danger],
    textColor: colors.white,
  },
  dangerOutline: {
    colors: ["transparent", "transparent"],
    textColor: colors.danger,
    borderColor: colors.danger,
  },
  success: {
    colors: [colors.success, colors.success],
    textColor: colors.white,
  },
};

const sizeStyles: Record<string, any> = {
  small: {
    container: {
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      borderRadius: borderRadius.sm,
    },
    text: { fontSize: 12 },
    iconSize: 16,
  },
  medium: {
    container: {
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      borderRadius: borderRadius.md,
    },
    text: { fontSize: 16 },
    iconSize: 20,
  },
  large: {
    container: {
      paddingVertical: spacing.lg,
      paddingHorizontal: spacing.xl,
      borderRadius: borderRadius.lg,
    },
    text: { fontSize: 18 },
    iconSize: 24,
  },
};

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
  },
  fullWidth: {
    width: "100%",
  },
  fill: {
    justifyContent: "center",
    alignItems: "center",
  },
  disabled: {
    opacity: 0.6,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontWeight: "600",
  },
  icon: {
    marginRight: spacing.sm,
  },
});
