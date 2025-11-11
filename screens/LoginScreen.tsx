import React, { useState } from "react";
import {
  Text,
  View,
  TextInput,
  SafeAreaView,
  Pressable,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
} from "react-native";
import { globalStyles, colors } from "../GlobalStyleSheet";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { loginWithEmail } from "../services/authService";
import { RootStackParamList } from "../types";
import { ModernLoader } from "../components/ModernLoader";

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "Login">;

const LoginScreen = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    setLoading(true);
    try {
      await loginWithEmail(email, password);
      navigation.navigate("Home");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Login failed";
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={{ 
              flexGrow: 1, 
              justifyContent: "center", 
              paddingHorizontal: 20,
              paddingVertical: 40,
            }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
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
              <TextInput
                placeholder="Email"
                placeholderTextColor={colors.textLight}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                onFocus={() => setFocusedInput('email')}
                onBlur={() => setFocusedInput(null)}
                style={[
                  globalStyles.inputField,
                  focusedInput === 'email' && globalStyles.inputFieldFocused
                ]}
              />
              <TextInput
                placeholder="Password"
                placeholderTextColor={colors.textLight}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                onFocus={() => setFocusedInput('password')}
                onBlur={() => setFocusedInput(null)}
                style={[
                  globalStyles.inputField,
                  focusedInput === 'password' && globalStyles.inputFieldFocused
                ]}
              />

              <Pressable
                onPress={handleLogin}
                disabled={loading}
                style={({ pressed }) => [
                  globalStyles.buttonContainer,
                  pressed && globalStyles.buttonContainerSecondary,
                ]}
              >
                {({ pressed }) => (
                  <Text
                    style={[
                      globalStyles.buttonText,
                      pressed && globalStyles.buttonTextSecondary,
                    ]}
                  >
                    {loading ? "Logging in..." : "Login"}
                  </Text>
                )}
              </Pressable>

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

            <Pressable 
              onPress={() => navigation.navigate("Terms")}
              style={globalStyles.linkButton}
            >
              <Text style={globalStyles.linkButtonText}>
                View Terms and Conditions
              </Text>
            </Pressable>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;
