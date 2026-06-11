import { useRef } from "react";
import { Animated } from "react-native";
import { haptic } from "../utils/haptics";

/**
 * Horizontal shake for invalid input, paired with an error haptic.
 * Attach `shakeStyle` to an Animated.View and call `shake()` when
 * validation fails.
 */
export const useShake = () => {
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const shake = () => {
    haptic.error();
    shakeAnim.setValue(0);
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 1, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -1, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 1, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  const shakeStyle = {
    transform: [
      {
        translateX: shakeAnim.interpolate({
          inputRange: [-1, 1],
          outputRange: [-8, 8],
        }),
      },
    ],
  };

  return { shake, shakeStyle };
};
