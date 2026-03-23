import React, { useRef, useEffect } from "react";
import { ScrollView, Text, Pressable, Animated, View, Modal } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { colors, spacing, typography, borderRadius, elevation } from "../GlobalStyleSheet";

interface TermsModalProps {
  visible: boolean;
  onClose: () => void;
  onAccept?: () => void;
  requireAccept?: boolean;
}

const TermsModal: React.FC<TermsModalProps> = ({ visible, onClose, onAccept, requireAccept = false }) => {
  const modalAnim = useRef(new Animated.Value(visible ? 1 : 0)).current;
  const modalOverlayAnim = useRef(new Animated.Value(visible ? 1 : 0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(modalAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 50,
          friction: 7,
        }),
        Animated.timing(modalOverlayAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleClose = () => {
    if (requireAccept) return; // Prevent closing without accepting
    
    Animated.parallel([
      Animated.spring(modalAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      }),
      Animated.timing(modalOverlayAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
    });
  };

  const handleAccept = () => {
    Animated.parallel([
      Animated.spring(modalAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      }),
      Animated.timing(modalOverlayAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (onAccept) {
        onAccept();
      } else {
        onClose();
      }
    });
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
    >
      <Animated.View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
          opacity: modalOverlayAnim,
        }}
      >
        <Pressable
          style={{ flex: 1 }}
          onPress={handleClose}
          disabled={requireAccept}
        />
      </Animated.View>
      <Animated.View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          maxHeight: '85%',
          backgroundColor: colors.white,
          borderTopLeftRadius: borderRadius.xl,
          borderTopRightRadius: borderRadius.xl,
          ...elevation.lg,
          transform: [{
            translateY: modalAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [600, 0],
            }),
          }],
        }}
      >
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: spacing.lg,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
            <MaterialIcons name="description" size={28} color={colors.primary} />
            <Text style={[typography.h2, { marginBottom: 0 }]}>
              Terms & Conditions
            </Text>
          </View>
          {!requireAccept && (
            <Pressable
              onPress={handleClose}
              hitSlop={10}
            >
              <MaterialIcons name="close" size={28} color={colors.textMedium} />
            </Pressable>
          )}
        </View>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: spacing.lg }}
          showsVerticalScrollIndicator={false}
        >
          <Text style={{
            ...typography.body,
            color: colors.textDark,
            lineHeight: 24,
            marginBottom: spacing.xl
          }}>
            This app is a personal project developed by a single developer to make shopping and sharing shopping lists easier.
            {"\n\n"}
            The app is provided as-is, without any warranties or guarantees. By using this app, you acknowledge that it is intended for personal use and convenience only.
            {"\n\n"}
            No personal data is sold or shared with third parties. Please use the app responsibly.
          </Text>
        </ScrollView>

        {requireAccept && (
          <View style={{
            padding: spacing.lg,
            borderTopWidth: 1,
            borderTopColor: colors.border,
            gap: spacing.md,
          }}>
            <Pressable
              onPress={handleAccept}
              style={({ pressed }) => [
                {
                  backgroundColor: colors.primary,
                  borderRadius: borderRadius.lg,
                  paddingVertical: spacing.lg,
                  paddingHorizontal: spacing.xl,
                  alignItems: 'center',
                  justifyContent: 'center',
                },
                pressed && { opacity: 0.8 },
              ]}
            >
              <Text style={{
                color: colors.white,
                fontSize: 16,
                fontWeight: '600',
              }}>
                I Accept Terms & Conditions
              </Text>
            </Pressable>
          </View>
        )}
      </Animated.View>
    </Modal>
  );
};

export default TermsModal;
