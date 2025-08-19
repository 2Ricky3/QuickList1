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
import { globalStyles } from "../GlobalStyleSheet";
import { ActivityIndicator } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { registerWithEmail } from "../services/authService";

import { RootStackParamList } from "../types";

const RegisterScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!email || !password || !name) {
      alert("All fields are required");
      return;
    }

    setLoading(true);
    try {
      await registerWithEmail(email, password, name);
      setLoading(false);
      navigation.navigate("Home");
    } catch (error: any) {
      setLoading(false);
      alert(error.message || "Registration failed");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
          >
            <View style={globalStyles.container}>
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
              <Text style={globalStyles.titleText}>Create Account</Text>

              <View style={globalStyles.formWrapper}>
                <TextInput
                  placeholder="Name"
                  value={name}
                  onChangeText={setName}
                  style={globalStyles.inputField}
                />
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
                  onPress={handleRegister}
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
                      {loading ? "Registering..." : "Register"}
                    </Text>
                  )}
                </Pressable>

                {loading && <ActivityIndicator size="large" color="#C20200" />}
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

              <TouchableOpacity onPress={() => navigation.navigate("Terms")}>
                <Text
                  style={{
                    color: "#C20200",
                    textAlign: "center",
                    marginTop: 16,
                  }}
                >
                  View Terms and Conditions
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RegisterScreen;
