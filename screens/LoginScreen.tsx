import React, { useState } from "react";
import {
  Text,
  View,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Animated,
  Pressable,
  StatusBar,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "../GlobalStyleSheet";
import { useNavigation, CommonActions } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { loginWithEmail } from "../services/authService";
import { getAdminCredentials } from "../services/adminService";
import { RootStackParamList } from "../types";
import { ModernLoader } from "../components/ModernLoader";
import { AnimatedPressable } from "../components/AnimatedPressable";
import { FormInput } from "../components/FormInput";
import { validateEmail, validatePassword } from "../utils/validation";
import { logAuthError } from "../services/errorLogger";
import { Toast } from "../components/Toast";
import { useToast } from "../hooks/useToast";
import TermsModal from "./TermsScreen";

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "Login">;

const LoginScreen = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const { toast, showToast, hideToast } = useToast();
  const scrollViewRef = React.useRef<ScrollView>(null);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleLogin = async () => {
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      showToast(emailValidation.error || "Invalid email", "error");
      return;
    }
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      showToast(passwordValidation.error || "Invalid password", "error");
      return;
    }
    setLoading(true);
    try {
      // Check if user is trying to access admin panel
      const adminCreds = getAdminCredentials();
      if (email === adminCreds.email && password === adminCreds.password) {
        // Admin login - go directly to admin panel
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: "AdminPanel" }],
          })
        );
        return;
      }

      await loginWithEmail(email, password);
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "Home" }],
        })
      );
    } catch (error: any) {
      logAuthError(error, 'Login with email');
      showToast(error.message || 'Login failed. Please try again.', "error");
    } finally {
      setLoading(false);
    }
  };
  return (
    <LinearGradient
      colors={["#FFFFFF", "#FFF4F4", "#FFE8E8"]}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
        <Toast
          message={toast.message}
          type={toast.type}
          visible={toast.visible}
          onHide={hideToast}
        />
        <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
            keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
          >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <ScrollView
                ref={scrollViewRef}
                contentContainerStyle={{
                  flexGrow: 1,
                  paddingHorizontal: 28,
                  paddingTop: 16,
                  paddingBottom: 40,
                }}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                decelerationRate="fast"
              >
                {/* Back */}
                <Pressable
                  onPress={() => navigation.goBack()}
                  style={loginStyles.backButton}
                >
                  <MaterialIcons name="chevron-left" size={28} color={colors.primary} />
                  <Text style={loginStyles.backText}>Back</Text>
                </Pressable>

                {/* Logo + heading */}
                <View style={loginStyles.logoSection}>
                  <View style={loginStyles.logoGlowOuter}>
                    <View style={loginStyles.logoGlowInner}>
                      <Image
                        source={require("../assets/Logo.png")}
                        style={loginStyles.logo}
                        resizeMode="contain"
                      />
                    </View>
                  </View>
                  <Text style={loginStyles.title}>Welcome back</Text>
                  <Text style={loginStyles.subtitle}>Sign in to continue</Text>
                </View>

                {/* Form */}
                <View style={loginStyles.formSection}>
                  <FormInput
                    placeholder="Email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                    onFocus={() => setFocusedInput("email")}
                    onBlur={() => setFocusedInput(null)}
                    isFocused={focusedInput === "email"}
                    icon="email"
                  />
                  <FormInput
                    placeholder="Password"
                    secureTextEntry={false}
                    value={password}
                    onChangeText={setPassword}
                    onFocus={() => setFocusedInput("password")}
                    onBlur={() => setFocusedInput(null)}
                    isFocused={focusedInput === "password"}
                    isPassword={true}
                    icon="lock"
                  />
                  <AnimatedPressable
                    onPress={handleLogin}
                    disabled={loading}
                    style={[loginStyles.buttonWrapper, loading && { opacity: 0.6 }]}
                  >
                    <LinearGradient
                      colors={["#D40000", "#FF3030"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={loginStyles.primaryButton}
                    >
                      <Text style={loginStyles.primaryButtonText}>
                        {loading ? "Signing in..." : "Sign In"}
                      </Text>
                    </LinearGradient>
                  </AnimatedPressable>
                  {loading && <ModernLoader size="large" style={{ marginTop: 16 }} />}
                </View>

                {/* Footer */}
                <View style={loginStyles.footer}>
                  <Text style={loginStyles.footerText}>
                    Don't have an account?{"  "}
                    <Text
                      style={loginStyles.footerLink}
                      onPress={() => navigation.navigate("Register")}
                    >
                      Create one
                    </Text>
                  </Text>
                  <AnimatedPressable
                    onPress={() => setShowTermsModal(true)}
                    style={loginStyles.termsButton}
                  >
                    <Text style={loginStyles.termsText}>Terms & Conditions</Text>
                  </AnimatedPressable>
                </View>
              </ScrollView>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        </Animated.View>
        <TermsModal
          visible={showTermsModal}
          onClose={() => setShowTermsModal(false)}
        />
      </SafeAreaView>
    </LinearGradient>
  );
};

const loginStyles = StyleSheet.create({
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    alignSelf: "flex-start",
    marginBottom: 8,
  },
  backText: {
    color: colors.primary,
    fontSize: 17,
    fontWeight: "600" as const,
    marginLeft: 2,
  },
  logoSection: {
    alignItems: "center",
    marginTop: 12,
    marginBottom: 28,
    gap: 8,
  },
  logoGlowOuter: {
    width: 136,
    height: 136,
    borderRadius: 68,
    backgroundColor: "rgba(194,2,0,0.06)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 32,
    elevation: 0,
  },
  logoGlowInner: {
    width: 114,
    height: 114,
    borderRadius: 57,
    backgroundColor: "rgba(194,2,0,0.08)",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 88,
    height: 88,
  },
  title: {
    fontSize: 32,
    fontWeight: "800" as const,
    color: "#1A1A1A",
    letterSpacing: -0.8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    fontWeight: "400" as const,
    color: colors.textMedium,
    textAlign: "center",
  },
  formSection: {
    marginBottom: 8,
  },
  buttonWrapper: {
    borderRadius: 999,
    overflow: "hidden",
    marginTop: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
  primaryButton: {
    borderRadius: 999,
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: {
    fontSize: 17,
    fontWeight: "700" as const,
    color: "#FFFFFF",
    letterSpacing: 0.3,
  },
  footer: {
    marginTop: 24,
    alignItems: "center",
    gap: 6,
  },
  footerText: {
    fontSize: 14,
    color: colors.textMedium,
    textAlign: "center",
  },
  footerLink: {
    color: colors.primary,
    fontWeight: "600" as const,
  },
  termsButton: {
    paddingVertical: 8,
  },
  termsText: {
    fontSize: 12.5,
    color: colors.textLight,
    textDecorationLine: "underline",
  },
});

export default LoginScreen;
