import React, { useRef, useEffect } from "react";
import { ScrollView, Text, Pressable, Animated, View, Modal, Easing } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
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

  const animateClose = (callback: () => void) => {
    Animated.parallel([
      Animated.timing(modalAnim, {
        toValue: 0,
        duration: 280,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(modalOverlayAnim, {
        toValue: 0,
        duration: 220,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start(() => callback());
  };

  const handleClose = () => {
    if (requireAccept) return;
    animateClose(onClose);
  };

  const handleAccept = () => {
    animateClose(() => {
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
          <View style={{
            backgroundColor: `${colors.primary}08`,
            borderRadius: borderRadius.lg,
            padding: spacing.lg,
            marginBottom: spacing.xl,
            flexDirection: 'row',
            alignItems: 'center',
            gap: spacing.sm,
          }}>
            <MaterialIcons name="celebration" size={20} color={colors.primary} />
            <Text style={{ fontSize: 14, color: colors.primary, fontWeight: '600', flex: 1 }}>
              QuickList is completely free — and always will be.
            </Text>
          </View>

          <Text style={[typography.h3, { marginBottom: spacing.sm }]}>About This App</Text>
          <Text style={{
            ...typography.body,
            color: colors.textDark,
            lineHeight: 24,
            marginBottom: spacing.xl
          }}>
            QuickList is a personal project developed by a single developer to make shopping and sharing grocery lists easier and more convenient.
          </Text>

          <Text style={[typography.h3, { marginBottom: spacing.sm }]}>Free to Use</Text>
          <Text style={{
            ...typography.body,
            color: colors.textDark,
            lineHeight: 24,
            marginBottom: spacing.xl
          }}>
            This app is free to use and will always remain free. To support ongoing development and server costs, QuickList may display advertisements or offer optional in-app features. No purchase is ever required to access the core functionality of the app.
          </Text>

          <Text style={[typography.h3, { marginBottom: spacing.sm }]}>Use & Privacy</Text>
          <Text style={{
            ...typography.body,
            color: colors.textDark,
            lineHeight: 24,
            marginBottom: spacing.xl
          }}>
            The app is provided as-is, without any warranties or guarantees. It is intended for personal use and convenience only. No personal data is sold or shared with third parties. Please use the app responsibly.
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
              style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1, borderRadius: 999, overflow: 'hidden' }]}
            >
              <LinearGradient
                colors={['#D40000', '#FF3030']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{
                  borderRadius: 999,
                  paddingVertical: 18,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text style={{
                  color: colors.white,
                  fontSize: 17,
                  fontWeight: '700',
                  letterSpacing: 0.3,
                }}>
                  I Accept & Continue
                </Text>
              </LinearGradient>
            </Pressable>
          </View>
        )}
      </Animated.View>
    </Modal>
  );
};

export default TermsModal;
