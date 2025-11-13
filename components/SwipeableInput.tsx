import React, { useRef, useState } from "react";
import { View, TextInput, Pressable, Animated, StyleSheet, TextInputProps, Text } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { MaterialIcons } from "@expo/vector-icons";
import { colors, spacing, borderRadius, elevation, globalStyles } from "../GlobalStyleSheet";
import * as Haptics from "expo-haptics";
interface SwipeableInputProps extends TextInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onDelete: () => void;
  isFocused?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
}
export const SwipeableInput: React.FC<SwipeableInputProps> = ({
  value,
  onChangeText,
  onDelete,
  isFocused,
  onFocus,
  onBlur,
  ...textInputProps
}) => {
  const swipeableRef = useRef<Swipeable>(null);
  const [isSwipeActive, setIsSwipeActive] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const handleDelete = async () => {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    // Animate the deletion
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 0.95,
        useNativeDriver: true,
        tension: 300,
        friction: 10,
      }),
      Animated.spring(scaleAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 200,
        friction: 15,
      }),
    ]).start(() => {
      swipeableRef.current?.close();
      onDelete();
      scaleAnim.setValue(1);
    });
  };
  const handleSwipeableOpen = () => {
    setIsSwipeActive(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };
  const handleSwipeableClose = () => {
    setIsSwipeActive(false);
  };
  const renderRightActions = (
    _progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>
  ) => {
    const translateX = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [0, 100],
      extrapolate: "clamp",
    });
    
    const scale = dragX.interpolate({
      inputRange: [-100, -50, 0],
      outputRange: [1, 1.1, 0.7],
      extrapolate: "clamp",
    });
    
    const opacity = dragX.interpolate({
      inputRange: [-100, -20, 0],
      outputRange: [1, 0.8, 0],
      extrapolate: "clamp",
    });

    const iconRotate = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: ["0deg", "180deg"],
      extrapolate: "clamp",
    });
    
    return (
      <Animated.View
        style={[
          styles.deleteContainer,
          {
            opacity,
            transform: [{ translateX }],
          },
        ]}
      >
        <Animated.View style={{ transform: [{ scale }] }}>
          <Pressable
            style={({ pressed }) => [
              styles.deleteButton,
              pressed && styles.deleteButtonPressed,
            ]}
            onPress={handleDelete}
          >
            <Animated.View style={{ transform: [{ rotate: iconRotate }] }}>
              <MaterialIcons name="delete-outline" size={26} color={colors.white} />
            </Animated.View>
            <Text style={styles.deleteText}>Delete</Text>
          </Pressable>
        </Animated.View>
      </Animated.View>
    );
  };
  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <Swipeable
        ref={swipeableRef}
        renderRightActions={renderRightActions}
        overshootRight={false}
        friction={2}
        rightThreshold={40}
        containerStyle={styles.swipeableContainer}
        onSwipeableOpen={handleSwipeableOpen}
        onSwipeableClose={handleSwipeableClose}
      >
        <View style={[styles.inputWrapper, isSwipeActive && styles.inputWrapperSwiped]}>
          <TextInput
            value={value}
            onChangeText={onChangeText}
            onFocus={onFocus}
            onBlur={onBlur}
            style={[
              globalStyles.inputField,
              styles.input,
              isFocused && globalStyles.inputFieldFocused,
            ]}
            {...textInputProps}
          />
        </View>
      </Swipeable>
    </Animated.View>
  );
};
const styles = StyleSheet.create({
  swipeableContainer: {
    marginBottom: spacing.md,
  },
  inputWrapper: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border,
  },
  inputWrapperSwiped: {
    borderColor: colors.danger + "40",
    backgroundColor: colors.danger + "05",
  },
  input: {
    marginBottom: 0,
    borderWidth: 0,
  },
  deleteContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: 100,
    marginLeft: spacing.sm,
  },
  deleteButton: {
    backgroundColor: colors.danger,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.xs,
    minHeight: 56,
    ...elevation.lg,
    shadowColor: colors.danger,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  deleteButtonPressed: {
    backgroundColor: "#A00000",
    transform: [{ scale: 0.95 }],
  },
  deleteText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});
