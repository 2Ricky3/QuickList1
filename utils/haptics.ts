import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

const isNative = Platform.OS !== "web";

/**
 * Centralized haptic feedback vocabulary so the same action always
 * feels the same everywhere in the app.
 *
 * - tap:       light impact for any ordinary button press / navigation
 * - press:     medium impact for primary CTAs (save, create, confirm)
 * - heavy:     heavy impact for strong/destructive presses
 * - selection: toggles, checkboxes, pickers, chips
 * - success / warning / error: operation outcomes
 */
export const haptic = {
  tap: () => {
    if (isNative) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  },
  press: () => {
    if (isNative) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  },
  heavy: () => {
    if (isNative) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  },
  selection: () => {
    if (isNative) Haptics.selectionAsync();
  },
  success: () => {
    if (isNative)
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  },
  warning: () => {
    if (isNative)
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  },
  error: () => {
    if (isNative)
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  },
};

export type HapticType = "tap" | "press" | "heavy" | "selection" | "none";

export const triggerHaptic = (type: HapticType) => {
  if (type === "none") return;
  haptic[type]();
};
