import React from "react";
import { SafeAreaView, ScrollView, Text, StyleSheet, View, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";

const TermsScreen = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Terms and Conditions</Text>
        <Text style={styles.text}>
          This app is a personal project developed by a single developer to make shopping and sharing shopping lists easier.
          {"\n\n"}
          The app is provided as-is, without any warranties or guarantees. By using this app, you acknowledge that it is intended for personal use and convenience only.
          {"\n\n"}
          No personal data is sold or shared with third parties. Please use the app responsibly.
        </Text>
        <View style={{ marginTop: 32 }}>
          <Pressable style={styles.button} onPress={() => navigation.goBack()}>
            <Text style={styles.buttonText}>Back</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  content: { padding: 24 },
  title: { fontSize: 28, fontWeight: "bold", color: "#C20200", marginBottom: 18 },
  text: { fontSize: 16, color: "#333", lineHeight: 24 },
  button: {
    backgroundColor: "#C20200",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
});

export default TermsScreen;