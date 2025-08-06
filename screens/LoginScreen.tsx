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
  ActivityIndicator,
} from "react-native";
import { globalStyles } from "../GlobalStyleSheet";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { signInWithEmailAndPassword } from "firebase/auth";
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
      await signInWithEmailAndPassword(auth, email, password);
      navigation.navigate("Home");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Login failed";
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={globalStyles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1, justifyContent: "center" }}
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
            style={globalStyles.buttonContainer}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={globalStyles.buttonText}>
              {loading ? "Logging in..." : "Login"}
            </Text>
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
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;
