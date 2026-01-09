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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { globalStyles, colors } from "../GlobalStyleSheet";
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

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "Login">;

const LoginScreen = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
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
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
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
              justifyContent: "center",
              paddingHorizontal: 20,
              paddingVertical: 40,
            }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            scrollEnabled={true}
            decelerationRate="fast"
          >
            <Image
              source={require("../assets/Logo.png")}
              style={{
                width: 100,
                height: 100,
                alignSelf: "center",
                marginBottom: 24,
              }}
              resizeMode="contain"
            />
            <Text style={globalStyles.titleText}>Sign In</Text>
            <View style={globalStyles.formWrapper}>
              <FormInput
                placeholder="Email"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                onFocus={() => setFocusedInput('email')}
                onBlur={() => setFocusedInput(null)}
                isFocused={focusedInput === 'email'}
                icon="email"
              />
              <FormInput
                placeholder="Password"
                secureTextEntry={false}
                value={password}
                onChangeText={setPassword}
                onFocus={() => setFocusedInput('password')}
                onBlur={() => setFocusedInput(null)}
                isFocused={focusedInput === 'password'}
                isPassword={true}
                icon="lock"
              />
              <AnimatedPressable
                onPress={handleLogin}
                disabled={loading}
                style={globalStyles.buttonContainer}
              >
                <Text style={globalStyles.buttonText}>
                  {loading ? "Logging in..." : "Login"}
                </Text>
              </AnimatedPressable>
              {loading && (
                <ModernLoader
                  size="large"
                  style={{ marginTop: 20 }}
                />
              )}
            </View>
            <Text style={globalStyles.footerText}>
              Don't have an account?{" "}
              <Text
                style={globalStyles.footerLink}
                onPress={() => navigation.navigate("Register")}
              >
                Register
              </Text>
            </Text>
            <AnimatedPressable
              onPress={() => navigation.navigate("Terms")}
              style={globalStyles.linkButton}
            >
              <Text style={globalStyles.linkButtonText}>
                View Terms and Conditions
              </Text>
            </AnimatedPressable>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
      </Animated.View>
    </SafeAreaView>
  );
};
export default LoginScreen;
