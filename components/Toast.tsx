import React, { useEffect, useRef } from "react";
import { Animated, Text, StyleSheet, ViewStyle } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { colors, spacing, borderRadius, elevation, typography } from "../GlobalStyleSheet";
type ToastType = "success" | "error" | "info" | "warning";
interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onHide?: () => void;
  visible: boolean;
}
export const Toast: React.FC<ToastProps> = ({
  message,
  type = "success",
  duration = 3000,
  onHide,
  visible,
}) => {
  const translateY = useRef(new Animated.Value(-100)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
      const timer = setTimeout(() => {
        hideToast();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [visible]);
  const hideToast = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (onHide) onHide();
    });
  };
  const getToastStyle = (): ViewStyle => {
    switch (type) {
      case "success":
        return { backgroundColor: colors.success };
      case "error":
        return { backgroundColor: colors.danger };
      case "warning":
        return { backgroundColor: colors.warning };
      case "info":
        return { backgroundColor: colors.primary };
      default:
        return { backgroundColor: colors.success };
    }
  };
  const getIcon = () => {
    switch (type) {
      case "success":
        return "check-circle";
      case "error":
        return "error";
      case "warning":
        return "warning";
      case "info":
        return "info";
      default:
        return "check-circle";
    }
  };
  if (!visible) return null;
  return (
    <Animated.View
      style={[
        styles.container,
        getToastStyle(),
        {
          transform: [{ translateY }],
          opacity,
        },
      ]}
    >
      <MaterialIcons name={getIcon()} size={24} color={colors.white} />
      <Text style={styles.message}>{message}</Text>
    </Animated.View>
  );
};
const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 50,
    left: spacing.lg,
    right: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    zIndex: 9999,
    ...elevation.lg,
  },
  message: {
    ...typography.bodyBold,
    color: colors.white,
    marginLeft: spacing.md,
    flex: 1,
  },
});
