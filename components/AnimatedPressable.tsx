import React, { useRef } from "react";
import { Pressable, Animated, PressableProps, StyleProp, ViewStyle } from "react-native";

interface AnimatedPressableProps extends PressableProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  scaleValue?: number;
}

export const AnimatedPressable: React.FC<AnimatedPressableProps> = ({
  children,
  style,
  scaleValue = 0.95,
  onPressIn,
  onPressOut,
  ...props
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = (event: any) => {
    Animated.spring(scaleAnim, {
      toValue: scaleValue,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
    if (onPressIn) onPressIn(event);
  };

  const handlePressOut = (event: any) => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
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
