import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { colors, spacing, typography } from "../GlobalStyleSheet";
import { IconButton } from "./IconButton";

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  rightIcon?: string;
  onRightPress?: () => void;
  backgroundColor?: string;
  centered?: boolean;
}

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  title,
  subtitle,
  showBackButton = true,
  rightIcon,
  onRightPress,
  backgroundColor = colors.white,
  centered = false,
}) => {
  const navigation = useNavigation();

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={styles.content}>
        {showBackButton && (
          <IconButton
            icon="arrow-back"
            onPress={() => navigation.goBack()}
            accessibilityLabel="Go back"
            style={styles.backButton}
          />
        )}

        <View style={[styles.textContainer, centered && styles.centered]}>
          <Text style={[typography.h2, styles.title]}>{title}</Text>
          {subtitle && <Text style={[typography.bodySmall, styles.subtitle]}>{subtitle}</Text>}
        </View>

        {rightIcon && onRightPress ? (
          <IconButton
            icon={rightIcon as any}
            onPress={onRightPress}
            style={styles.rightButton}
          />
        ) : (
          <View style={styles.rightButton} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    width: 44,
    height: 44,
  },
  rightButton: {
    width: 44,
    height: 44,
  },
  textContainer: {
    flex: 1,
    marginHorizontal: spacing.md,
  },
  centered: {
    alignItems: "center",
    marginHorizontal: 0,
  },
  title: {
    color: colors.textDark,
    marginBottom: spacing.xs,
  },
  subtitle: {
    color: colors.textMedium,
  },
});
