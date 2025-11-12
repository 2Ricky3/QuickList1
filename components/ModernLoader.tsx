import React, { useEffect, useRef } from "react";
import { View, Animated, StyleSheet, ViewStyle } from "react-native";
import { colors } from "../GlobalStyleSheet";
interface ModernLoaderProps {
  size?: "small" | "medium" | "large";
  color?: string;
  style?: ViewStyle;
}
export const ModernLoader: React.FC<ModernLoaderProps> = ({
  size = "medium",
  color = colors.primary,
  style
}) => {
  const spinValue = useRef(new Animated.Value(0)).current;
  const scaleValue1 = useRef(new Animated.Value(1)).current;
  const scaleValue2 = useRef(new Animated.Value(1)).current;
  const scaleValue3 = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    const spinAnimation = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    );
    const dotAnimation1 = Animated.loop(
      Animated.sequence([
        Animated.timing(scaleValue1, {
          toValue: 1.5,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(scaleValue1, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ])
    );
    const dotAnimation2 = Animated.loop(
      Animated.sequence([
        Animated.delay(200),
        Animated.timing(scaleValue2, {
          toValue: 1.5,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(scaleValue2, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ])
    );
    const dotAnimation3 = Animated.loop(
      Animated.sequence([
        Animated.delay(400),
        Animated.timing(scaleValue3, {
          toValue: 1.5,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(scaleValue3, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ])
    );
    spinAnimation.start();
    dotAnimation1.start();
    dotAnimation2.start();
    dotAnimation3.start();
    return () => {
      spinAnimation.stop();
      dotAnimation1.stop();
      dotAnimation2.stop();
      dotAnimation3.stop();
    };
  }, []);
  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });
  const sizes = {
    small: 8,
    medium: 12,
    large: 16,
  };
  const dotSize = sizes[size];
  return (
    <View style={[styles.container, style]}>
      <View style={styles.dotsContainer}>
        <Animated.View
          style={[
            styles.dot,
            {
              width: dotSize,
              height: dotSize,
              backgroundColor: color,
              transform: [{ scale: scaleValue1 }],
            },
          ]}
        />
        <Animated.View
          style={[
            styles.dot,
            {
              width: dotSize,
              height: dotSize,
              backgroundColor: color,
              transform: [{ scale: scaleValue2 }],
            },
          ]}
        />
        <Animated.View
          style={[
            styles.dot,
            {
              width: dotSize,
              height: dotSize,
              backgroundColor: color,
              transform: [{ scale: scaleValue3 }],
            },
          ]}
        />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  dotsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dot: {
    borderRadius: 999,
  },
});
