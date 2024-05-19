import { useState } from "react";
import { Alert, ImageBackground, Text, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { Button } from "@/components/Button";

import { GoogleSignin } from "@react-native-google-signin/google-signin";

GoogleSignin.configure({
  scopes: ["email", "profile"],
  webClientId: process.env.WEB_CLIENT_ID,
  iosClientId: process.env.IOS_CLIENT_ID,
});

export function SignIn() {
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  async function handleGoogleSignIn() {
    try {
      setIsAuthenticating(true);

      const { idToken } = await GoogleSignin.signIn();

      if (idToken) {
      } else {
        Alert.alert("Entrar", "Erro ao fazer login com o Google.");

        setIsAuthenticating(false);

        return;
      }

      setIsAuthenticating(false);

      Alert.alert("Entrar", "Usuário autenticado com sucesso.");
    } catch (error) {
      console.error(error);

      setIsAuthenticating(false);

      Alert.alert("Entrar", "Erro ao fazer login com o Google.");
    }
  }

  return (
    <View className="flex-1 bg-gray-800">
      <ImageBackground
        className="flex-1 items-center justify-center"
        source={require("@/assets/background.png")}
      >
        <Text className="text-brand-light text-3xl font-bold">
          Ignite Fleet
        </Text>
        <Text className="text-gray-100">Gestão de uso de veículos</Text>

        <View className="w-full p-8">
          <Button
            label="Entrar com Google"
            isLoading={isAuthenticating}
            icon={<Ionicons name="logo-google" size={20} color="white" />}
            onPress={handleGoogleSignIn}
          />
        </View>
      </ImageBackground>
    </View>
  );
}
