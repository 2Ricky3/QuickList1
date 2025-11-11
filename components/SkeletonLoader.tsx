import React, { useEffect, useRef } from "react";
import { View, Animated, StyleSheet, ViewStyle } from "react-native";
import { colors } from "../GlobalStyleSheet";

interface SkeletonLoaderProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  width = "100%",
  height = 20,
  borderRadius = 8,
  style,
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );

    animation.start();

    return () => animation.stop();
  }, []);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <Animated.View
      style={[
        styles.skeleton,
        style,
        {
          width: width as any,
          height,
          borderRadius,
          opacity,
        },
      ]}
    />
  );
};

export const CardSkeleton: React.FC = () => {
  return (
    <View style={styles.cardContainer}>
      <SkeletonLoader height={24} width="70%" style={{ marginBottom: 12 }} />
      <SkeletonLoader height={16} width="90%" style={{ marginBottom: 8 }} />
      <SkeletonLoader height={16} width="60%" style={{ marginBottom: 16 }} />
      <View style={styles.tagContainer}>
        <SkeletonLoader height={24} width={80} borderRadius={12} />
        <SkeletonLoader height={24} width={100} borderRadius={12} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: colors.border,
  },
  cardContainer: {
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tagContainer: {
    flexDirection: "row",
    gap: 8,
  },
});
