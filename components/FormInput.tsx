import React, { useState } from "react";
import { View, Text, TextInput, TextInputProps, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { colors, spacing, borderRadius } from "../GlobalStyleSheet";

interface FormInputProps extends TextInputProps {
  icon?: string;
  isFocused?: boolean;
  hasError?: boolean;
  errorMessage?: string;
  isPassword?: boolean;
}

export const FormInput: React.FC<FormInputProps> = ({
  icon,
  isFocused = false,
  hasError = false,
  errorMessage,
  isPassword = false,
  style,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.inputWrapper,
          isFocused && styles.inputWrapperFocused,
          hasError && styles.inputWrapperError,
        ]}
      >
        {icon && (
          <MaterialIcons
            name={icon as any}
            size={20}
            color={isFocused ? colors.primary : colors.textMedium}
            style={styles.icon}
          />
        )}
        <TextInput
          {...props}
          style={[styles.input, style]}
          placeholderTextColor={colors.textLight}
          secureTextEntry={isPassword && !showPassword}
        />
        {isPassword && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.passwordToggle}
            activeOpacity={0.7}
          >
            <MaterialIcons
              name={showPassword ? "visibility" : "visibility-off"}
              size={20}
              color={isFocused ? colors.primary : colors.textMedium}
            />
          </TouchableOpacity>
        )}
      </View>
      {hasError && errorMessage && (
        <View style={styles.errorContainer}>
          <MaterialIcons name="error" size={14} color={colors.danger} />
          <Text style={styles.errorText}>{errorMessage}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    backgroundColor: colors.backgroundLight,
    paddingHorizontal: spacing.lg,
    height: 48,
  },
  inputWrapperFocused: {
    borderColor: colors.primary,
    backgroundColor: colors.white,
  },
  inputWrapperError: {
    borderColor: colors.danger,
    backgroundColor: "#FFEBEE",
  },
  icon: {
    marginRight: spacing.md,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.textDark,
  },
  passwordToggle: {
    padding: spacing.sm,
    marginLeft: spacing.sm,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.sm,
    paddingHorizontal: spacing.sm,
  },
  errorText: {
    fontSize: 12,
    color: colors.danger,
    marginLeft: spacing.sm,
  },
});
