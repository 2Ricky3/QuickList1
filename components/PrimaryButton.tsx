import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import { colors, spacing, borderRadius, typography } from "../GlobalStyleSheet";
import { AnimatedPressable } from "./AnimatedPressable";

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  icon?: string;
  variant?: "primary" | "secondary" | "danger" | "success";
  size?: "small" | "medium" | "large";
  fullWidth?: boolean;
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
  style,
}) => {
  const isDisabled = disabled || loading;
  const variantConfig = variantStyles[variant];
  const sizeConfig = sizeStyles[size];

  return (
    <AnimatedPressable
      onPress={onPress}
      disabled={isDisabled}
      style={[
        styles.container,
        fullWidth && styles.fullWidth,
        sizeConfig.container,
        style,
      ]}
    >
      {variant === "primary" ? (
        <LinearGradient
          colors={[variantConfig.colors[0], variantConfig.colors[1]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.gradient, sizeConfig.container]}
        >
          <View style={styles.content}>
            {icon && !loading && (
              <MaterialIcons
                name={icon as any}
                size={sizeConfig.iconSize}
                color={colors.white}
                style={styles.icon}
              />
            )}
            <Text style={[typography.button, styles.text, sizeConfig.text]}>
              {loading ? "Loading..." : title}
            </Text>
          </View>
        </LinearGradient>
      ) : (
        <View
          style={[
            styles.solidButton,
            { backgroundColor: variantConfig.colors[0] },
            isDisabled && styles.disabled,
            sizeConfig.container,
          ]}
        >
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
        </View>
      )}
    </AnimatedPressable>
  );
};

const variantStyles: Record<
  string,
  { colors: [string, string]; textColor: string }
> = {
  primary: {
    colors: [colors.primary, colors.primaryLight],
    textColor: colors.white,
  },
  secondary: {
    colors: [colors.backgroundLight, colors.backgroundLight],
    textColor: colors.textDark,
  },
  danger: {
    colors: [colors.danger, "#FF6B6B"],
    textColor: colors.white,
  },
  success: {
    colors: [colors.success, "#2ECC71"],
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
  gradient: {
    justifyContent: "center",
    alignItems: "center",
  },
  solidButton: {
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
