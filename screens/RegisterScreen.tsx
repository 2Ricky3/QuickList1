import React, { useState } from "react";
import {
  Text,
  View,
  SafeAreaView,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Animated,
} from "react-native";
import { globalStyles, colors } from "../GlobalStyleSheet";
import { ModernLoader } from "../components/ModernLoader";
import { AnimatedPressable } from "../components/AnimatedPressable";
import { FormInput } from "../components/FormInput";
import { useNavigation, CommonActions } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { registerWithEmail } from "../services/authService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { validateEmail, validatePassword, sanitizeString } from "../utils/validation";
import { logAuthError, errorLogger } from "../services/errorLogger";
import { RootStackParamList } from "../types";
import { Toast } from "../components/Toast";
import { useToast } from "../hooks/useToast";

const RegisterScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
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
  const handleRegister = async () => {
    const sanitizedName = sanitizeString(name.trim());
    if (sanitizedName.length < 2) {
      showToast("Name must be at least 2 characters", "error");
      return;
    }
    if (sanitizedName.length > 50) {
      showToast("Name must be less than 50 characters", "error");
      return;
    }
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
      const user = await registerWithEmail(email, password, sanitizedName);
      errorLogger.setUserContext(user.uid, user.email || undefined);
      setLoading(false);
      const onboardingSeen = await AsyncStorage.getItem(`onboardingSeen:${user.uid}`);
      if (!onboardingSeen) {
        navigation.replace("Onboarding", { userId: user.uid });
      } else {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: "Home" }],
          })
        );
      }
    } catch (error: any) {
      logAuthError(error, 'Register with email');
      setLoading(false);
      showToast(error.message || 'Registration failed. Please try again.', "error");
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
              paddingHorizontal: 20,
              paddingVertical: 40,
            }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            scrollEnabled={true}
            decelerationRate="fast"
          >
            <View style={{ flex: 1, justifyContent: "center" }}>
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
              <Text style={globalStyles.titleText}>Create Account</Text>
              <View style={globalStyles.formWrapper}>
                <FormInput
                  placeholder="Name"
                  value={name}
                  onChangeText={setName}
                  onFocus={() => setFocusedInput('name')}
                  onBlur={() => setFocusedInput(null)}
                  isFocused={focusedInput === 'name'}
                  icon="person"
                />
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
                  onPress={handleRegister}
                  disabled={loading}
                  style={globalStyles.buttonContainer}
                >
                  <Text style={globalStyles.buttonText}>
                    {loading ? "Registering..." : "Register"}
                  </Text>
                </AnimatedPressable>
                {loading && <ModernLoader size="large" style={{ marginTop: 20 }} />}
              </View>
              <Text style={globalStyles.footerText}>
                Already have an account?{" "}
                <Text
                  style={globalStyles.footerLink}
                  onPress={() => navigation.navigate("Login")}
                >
                  Sign In
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
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
      </Animated.View>
    </SafeAreaView>
  );
};
export default RegisterScreen;
