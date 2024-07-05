import "react-native-get-random-values";
import "./src/libs/dayjs";

import { View } from "react-native";

import { RealmProvider } from "@/libs/realm";
import { AppProvider, UserProvider } from "@realm/react";

import { SafeAreaProvider } from "react-native-safe-area-context";

import { SignIn } from "@/screens/SignIn";

import { StatusBar } from "expo-status-bar";

import { Routes } from "@/routes";

import "@/styles/global.css";

export default function App() {
  return (
    <AppProvider id={String(process.env.EXPO_PUBLIC_REALM_APP_ID)}>
      <SafeAreaProvider>
        <View className="flex-1 bg-gray-800">
          <UserProvider fallback={SignIn}>
            <RealmProvider>
              <Routes />
            </RealmProvider>
          </UserProvider>
          <StatusBar style="auto" />
        </View>
      </SafeAreaProvider>
    </AppProvider>
  );
}
