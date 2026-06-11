import React, { useRef } from "react";
import { Pressable, Animated, PressableProps, StyleProp, ViewStyle } from "react-native";
import { triggerHaptic, HapticType } from "../utils/haptics";
import { motion } from "../GlobalStyleSheet";
interface AnimatedPressableProps extends PressableProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  scaleValue?: number;
  /** Haptic feedback fired on press-in. Defaults to a light tap. */
  haptic?: HapticType;
}
export const AnimatedPressable: React.FC<AnimatedPressableProps> = ({
  children,
  style,
  scaleValue = 0.95,
  haptic = "tap",
  onPressIn,
  onPressOut,
  ...props
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const handlePressIn = (event: any) => {
    triggerHaptic(haptic);
    Animated.spring(scaleAnim, {
      toValue: scaleValue,
      useNativeDriver: true,
      ...motion.pressSpring,
    }).start();
    if (onPressIn) onPressIn(event);
  };
  const handlePressOut = (event: any) => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      ...motion.pressSpring,
    }).start();
    if (onPressOut) onPressOut(event);
  };
  return (
    <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut} {...props}>
      <Animated.View style={[style, { transform: [{ scale: scaleAnim }] }]}>
        {children}
      </Animated.View>
    </Pressable>
  );
};
