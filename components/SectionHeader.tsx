import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, spacing, typography, borderRadius } from "../GlobalStyleSheet";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  rightAction?: React.ReactNode;
  variant?: "default" | "accent";
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  rightAction,
  variant = "default",
}) => {
  return (
    <View
      style={[
        styles.container,
        variant === "accent" && styles.accentContainer,
      ]}
    >
      <View style={styles.textContainer}>
        <Text style={[typography.h3, styles.title]}>{title}</Text>
        {subtitle && (
          <Text style={[typography.bodySmall, styles.subtitle]}>{subtitle}</Text>
        )}
      </View>
      {rightAction && <View style={styles.action}>{rightAction}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.xs,
  },
  accentContainer: {
    backgroundColor: colors.backgroundLight,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.md,
    marginHorizontal: -spacing.lg,
    marginBottom: spacing.xl,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    color: colors.textDark,
    marginBottom: spacing.xs,
  },
  subtitle: {
    color: colors.textMedium,
  },
  action: {
    marginLeft: spacing.lg,
  },
});
