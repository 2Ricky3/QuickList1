import React, { useState } from "react";
import { Text, View, TextInput, SafeAreaView, Pressable } from "react-native";
import { globalStyles } from "../GlobalStyleSheet";
import { ActivityIndicator } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";

const LoginScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setLoading(false);
      navigation.navigate("Home");
    } catch (error: any) {
      setLoading(false);
      alert(error.message || "Login failed");
    }
  };

  const focusedInputStyle = {
    borderColor: "#8400c2ff",
    shadowColor: "#8400c2ff",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f0f0f0" }}>
      <View style={globalStyles.container}>
        <Text style={{ fontSize: 32, fontWeight: "bold", marginBottom: 32, color: "#8400c2ff" }}>
          Sign In
        </Text>
        <TextInput
          keyboardType="email-address"
          placeholder="Email"
          onChangeText={setEmail}
          value={email}
          style={[globalStyles.inputField, emailFocused && focusedInputStyle]}
          autoCapitalize="none"
          onFocus={() => setEmailFocused(true)}
          onBlur={() => setEmailFocused(false)}
        />
        <TextInput
          placeholder="Password"
          secureTextEntry={true}
          onChangeText={setPassword}
          value={password}
          style={[globalStyles.inputField, passwordFocused && focusedInputStyle]}
          onFocus={() => setPasswordFocused(true)}
          onBlur={() => setPasswordFocused(false)}
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
        {loading && <ActivityIndicator size="large" color="#007BFF" />}
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;
