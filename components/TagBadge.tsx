import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { colors, spacing, borderRadius } from "../GlobalStyleSheet";

interface TagBadgeProps {
  label: string;
  onRemove?: () => void;
  color?: string;
  size?: "small" | "medium";
}

export const TagBadge: React.FC<TagBadgeProps> = ({
  label,
  onRemove,
  color = colors.primary,
  size = "medium",
}) => {
  const isSmall = size === "small";

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: `${color}15`, borderColor: color },
        isSmall && styles.small,
      ]}
    >
      <Text
        style={[
          styles.label,
          { color },
          isSmall && styles.labelSmall,
        ]}
      >
        {label}
      </Text>
      {onRemove && (
        <MaterialIcons
          name="close"
          size={isSmall ? 14 : 16}
          color={color}
          onPress={onRemove}
          style={styles.icon}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.round,
    borderWidth: 1,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  small: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
  },
  labelSmall: {
    fontSize: 12,
    fontWeight: "400",
  },
  icon: {
    marginLeft: spacing.sm,
  },
});
