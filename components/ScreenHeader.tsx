import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { colors, spacing, typography } from "../GlobalStyleSheet";

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
          <Pressable
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <MaterialIcons name="arrow-back" size={24} color={colors.textDark} />
          </Pressable>
        )}

        <View style={[styles.textContainer, centered && styles.centered]}>
          <Text style={[typography.h2, styles.title]}>{title}</Text>
          {subtitle && <Text style={[typography.bodySmall, styles.subtitle]}>{subtitle}</Text>}
        </View>

        {rightIcon && onRightPress ? (
          <Pressable
            onPress={onRightPress}
            style={styles.rightButton}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <MaterialIcons name={rightIcon as any} size={24} color={colors.textDark} />
          </Pressable>
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
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  rightButton: {
    width: 40,
    height: 40,
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
