import React, { useRef } from "react";
import { View, TextInput, Pressable, Animated, StyleSheet, TextInputProps } from "react-native";
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
  const handleDelete = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    swipeableRef.current?.close();
    onDelete();
  };
  const renderRightActions = (
    progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>
  ) => {
    const scale = dragX.interpolate({
      inputRange: [-100, -50, 0],
      outputRange: [1, 0.9, 0.8],
      extrapolate: "clamp",
    });
    const opacity = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [1, 0],
      extrapolate: "clamp",
    });
    return (
      <Animated.View
        style={[
          styles.deleteContainer,
          {
            opacity,
            transform: [{ scale }],
          },
        ]}
      >
        <Pressable
          style={({ pressed }) => [
            styles.deleteButton,
            { opacity: pressed ? 0.7 : 1 },
          ]}
          onPress={handleDelete}
        >
          <MaterialIcons name="delete" size={22} color={colors.white} />
        </Pressable>
      </Animated.View>
    );
  };
  return (
    <Swipeable
      ref={swipeableRef}
      renderRightActions={renderRightActions}
      overshootRight={false}
      friction={2}
      rightThreshold={40}
      containerStyle={styles.swipeableContainer}
    >
      <View style={styles.inputWrapper}>
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
  },
  input: {
    marginBottom: 0,
  },
  deleteContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    marginLeft: spacing.sm,
  },
  deleteButton: {
    backgroundColor: colors.danger,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    ...elevation.lg,
  },
});
