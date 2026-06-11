import React from "react";
import { StyleSheet, StyleProp, ViewStyle } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "../GlobalStyleSheet";
import { AnimatedPressable } from "./AnimatedPressable";
import { HapticType } from "../utils/haptics";

interface IconButtonProps {
  icon: keyof typeof MaterialIcons.glyphMap;
  onPress: () => void;
  size?: number;
  color?: string;
  backgroundColor?: string;
  disabled?: boolean;
  haptic?: HapticType;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
}

/**
 * Icon-only button with a guaranteed 44pt touch target, press-scale
 * animation, and haptic feedback — use for back buttons, close buttons,
 * delete icons, visibility toggles, etc.
 */
export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  onPress,
  size = 24,
  color = colors.textDark,
  backgroundColor,
  disabled = false,
  haptic = "tap",
  accessibilityLabel,
  style,
}) => {
  return (
    <AnimatedPressable
      onPress={onPress}
      disabled={disabled}
      haptic={disabled ? "none" : haptic}
      scaleValue={0.85}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      style={[
        styles.container,
        backgroundColor != null && { backgroundColor },
        disabled && styles.disabled,
        style,
      ]}
    >
      <MaterialIcons name={icon} size={size} color={color} />
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  container: {
    minWidth: 44,
    minHeight: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  disabled: {
    opacity: 0.4,
  },
});
