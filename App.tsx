import "react-native-get-random-values";
import "./src/libs/dayjs";

import { ActivityIndicator, View } from "react-native";

import { ToastProvider } from "@/components/Toast";

import { RealmProvider, syncConfig } from "@/libs/realm";
import { AppProvider, UserProvider } from "@realm/react";

import { SafeAreaProvider } from "react-native-safe-area-context";

import { SignIn } from "@/screens/SignIn";

import { StatusBar } from "expo-status-bar";

import { Routes } from "@/routes";

import { colors } from "@/styles/colors";
import "@/styles/global.css";

export default function App() {
  return (
    <AppProvider id={String(process.env.EXPO_PUBLIC_REALM_APP_ID)}>
      <SafeAreaProvider>
        <ToastProvider position="bottom">
          <View className="flex-1 bg-gray-800">
            <UserProvider fallback={SignIn}>
              <RealmProvider
                sync={{
                  ...syncConfig,
                  initialSubscriptions: {
                    update(subs, realm) {
                      subs.add(realm.objects("Historic"));
                    },
                    rerunOnOpen: true,
                  },
                }}
                fallback={
                  <View className="flex-1 items-center justify-center">
                    <ActivityIndicator
                      color={colors["brand-light"]}
                      size="large"
                    />
                  </View>
                }
              >
                <Routes />
              </RealmProvider>
            </UserProvider>
            <StatusBar style="auto" />
          </View>
        </ToastProvider>
      </SafeAreaProvider>
    </AppProvider>
  );
}
