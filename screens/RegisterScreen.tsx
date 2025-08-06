import React, { useState } from "react";
import {
  Text,
  View,
  TextInput,
  SafeAreaView,
  Pressable,
  Image
} from "react-native";
import { globalStyles } from "../GlobalStyleSheet";
import { ActivityIndicator } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";

type RootStackParamList = {
  Home: undefined;
  Login: undefined;
};

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
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        email,
        displayName: name,
        createdAt: serverTimestamp(),
      });

      setLoading(false);
      alert("Account created!");
      navigation.navigate("Login");
    } catch (error: any) {
      setLoading(false);
      alert(error.message || "Registration failed");
    }
  };

  return (
    <SafeAreaView style={globalStyles.container}>
      <Image
        source={require("../assets/Logo.png")}
        style={{ width: 120, height: 120, alignSelf: "center", marginBottom: 20 }}
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
          style={globalStyles.buttonContainer}
          onPress={handleRegister}
          disabled={loading}
        >
          <Text style={globalStyles.buttonText}>
            {loading ? "Registering..." : "Register"}
          </Text>
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
    </SafeAreaView>
  );
};

export default RegisterScreen;
