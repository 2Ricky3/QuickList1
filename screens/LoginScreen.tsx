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
  ActivityIndicator,
} from "react-native";
import { globalStyles } from "../GlobalStyleSheet";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { loginWithEmail } from "../services/authService";
import { auth } from "../firebaseConfig";
import { RootStackParamList } from "../types";

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "Login">;

const LoginScreen = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

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
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={{ flexGrow: 1, justifyContent: "center", padding: 20 }}
            keyboardShouldPersistTaps="handled"
          >
            <Image
              source={require("../assets/Logo.png")}
              style={{
                width: 120,
                height: 120,
                alignSelf: "center",
                marginBottom: 20,
              }}
              resizeMode="contain"
            />

            <Text style={globalStyles.titleText}>Sign In</Text>

            <View style={globalStyles.formWrapper}>
              <TextInput
                placeholder="Email"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                style={globalStyles.inputField}
              />
              <TextInput
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                style={globalStyles.inputField}
              />

              <Pressable
                onPress={handleLogin}
                disabled={loading}
                style={({ pressed }) => [
                  globalStyles.buttonContainer,
                  pressed && {
                    backgroundColor: "#fff",
                    borderWidth: 1,
                    borderColor: "#C20200",
                  },
                ]}
              >
                {({ pressed }) => (
                  <Text
                    style={[
                      globalStyles.buttonText,
                      pressed && { color: "#C20200" },
                    ]}
                  >
                    {loading ? "Logging in..." : "Login"}
                  </Text>
                )}
              </Pressable>

              {loading && (
                <ActivityIndicator
                  size="large"
                  color="#C20200"
                  style={{ marginTop: 20 }}
                />
              )}
            </View>

            <Text style={globalStyles.footerText}>
              Don’t have an account?{" "}
              <Text
                style={globalStyles.footerLink}
                onPress={() => navigation.navigate("Register")}
              >
                Register
              </Text>
            </Text>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;
