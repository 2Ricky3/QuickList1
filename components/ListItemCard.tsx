import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { colors, spacing, borderRadius, elevation, typography } from "../GlobalStyleSheet";

interface ListItemCardProps {
  title: string;
  subtitle?: string;
  icon?: string;
  badge?: number;
  onPress?: () => void;
  onDelete?: () => void;
  rightElement?: React.ReactNode;
  color?: string;
  completed?: boolean;
}

export const ListItemCard: React.FC<ListItemCardProps> = ({
  title,
  subtitle,
  icon = "list",
  badge,
  onPress,
  onDelete,
  rightElement,
  color = colors.primary,
  completed = false,
}) => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed,
        completed && styles.completed,
        { ...elevation.sm },
      ]}
    >
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: `${color}15`, borderColor: color },
        ]}
      >
        <MaterialIcons name={icon as any} size={24} color={color} />
      </View>

      <View style={styles.content}>
        <Text
          style={[
            typography.bodyBold,
            styles.title,
            completed && styles.completedText,
          ]}
          numberOfLines={1}
        >
          {title}
        </Text>
        {subtitle && (
          <Text
            style={[typography.bodySmall, styles.subtitle]}
            numberOfLines={1}
          >
            {subtitle}
          </Text>
        )}
      </View>

      {badge !== undefined && badge > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      )}

      {rightElement}

      {onDelete && (
        <Pressable
          onPress={onDelete}
          style={styles.deleteButton}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <MaterialIcons name="close" size={20} color={colors.danger} />
        </Pressable>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  pressed: {
    opacity: 0.7,
  },
  completed: {
    opacity: 0.6,
    backgroundColor: colors.backgroundLight,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.lg,
  },
  content: {
    flex: 1,
  },
  title: {
    color: colors.textDark,
    marginBottom: spacing.xs,
  },
  completedText: {
    textDecorationLine: "line-through",
    color: colors.textMedium,
  },
  subtitle: {
    color: colors.textMedium,
  },
  badge: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.round,
    width: 28,
    height: 28,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.lg,
  },
  badgeText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: "600",
  },
  deleteButton: {
    padding: spacing.sm,
  },
});
