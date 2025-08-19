import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StyleSheet } from "react-native";

import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import HomeScreen from "./screens/HomeScreen";
import CreateScreen from "./screens/CreateScreen";
import PreviousListScreen from "./screens/PreviousListScreen";
import EditListScreen from "./screens/EditListScreen";

import { RootStackParamList } from "./types"; 

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <NavigationContainer>
        <StatusBar style="dark" />
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{
            headerStyle: { backgroundColor: "#ffffffff" },
            headerTintColor: "#520600",
            headerTitleStyle: { fontWeight: "bold", fontSize: 22 },
            headerShadowVisible: false,
          }}
        >
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="CreateScreen"
            component={CreateScreen}
            options={{ title: "Create List" }}
          />
            <Stack.Screen
            name="PreviousListScreen"
            component={PreviousListScreen}
            options={{ title: "Previous Lists" }}
          />
           <Stack.Screen
            name="EditListScreen"
            component={EditListScreen}
            options={{ title: "Edit List Screen" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
