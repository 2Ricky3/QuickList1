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
} from "react-native";
import { globalStyles, colors } from "../GlobalStyleSheet";
import { ModernLoader } from "../components/ModernLoader";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { registerWithEmail } from "../services/authService";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { RootStackParamList } from "../types";

const RegisterScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  const handleRegister = async () => {
    if (!email || !password || !name) {
      alert("All fields are required");
      return;
    }

    setLoading(true);
    try {
      const user = await registerWithEmail(email, password, name);
      setLoading(false);
      const onboardingSeen = await AsyncStorage.getItem(`onboardingSeen:${user.uid}`);
      if (!onboardingSeen) {
        navigation.replace("Onboarding", { userId: user.uid });
      } else {
        navigation.navigate("Home");
      }
    } catch (error: any) {
      setLoading(false);
      alert(error.message || "Registration failed");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={{ 
              flexGrow: 1, 
              paddingHorizontal: 20,
              paddingVertical: 40,
            }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
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
                <TextInput
                  placeholder="Name"
                  placeholderTextColor={colors.textLight}
                  value={name}
                  onChangeText={setName}
                  onFocus={() => setFocusedInput('name')}
                  onBlur={() => setFocusedInput(null)}
                  style={[
                    globalStyles.inputField,
                    focusedInput === 'name' && globalStyles.inputFieldFocused
                  ]}
                />
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
                  onPress={handleRegister}
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
                      {loading ? "Registering..." : "Register"}
                    </Text>
                  )}
                </Pressable>

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

              <Pressable 
                onPress={() => navigation.navigate("Terms")}
                style={globalStyles.linkButton}
              >
                <Text style={globalStyles.linkButtonText}>
                  View Terms and Conditions
                </Text>
              </Pressable>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RegisterScreen;
