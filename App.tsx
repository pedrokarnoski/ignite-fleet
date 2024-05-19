import { View } from "react-native";

import { AppProvider, UserProvider } from "@realm/react";

import { Home } from "@/screens/Home";
import { SignIn } from "@/screens/SignIn";

import { StatusBar } from "expo-status-bar";

import "@/styles/global.css";

export default function App() {
  return (
    <AppProvider id={String(process.env.EXPO_PUBLIC_REALM_APP_ID)}>
      <View className="flex-1">
        <UserProvider fallback={SignIn}>
          <Home />
        </UserProvider>
        <StatusBar style="auto" />
      </View>
    </AppProvider>
  );
}
