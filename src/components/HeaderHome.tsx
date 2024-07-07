import { Text, TouchableOpacity, View } from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useApp, useUser } from "@realm/react";

import { Ionicons } from "@expo/vector-icons";

import { colors } from "@/styles/colors";

import { Avatar, AvatarImage } from "./Avatar";

export function HeaderHome() {
  const user = useUser();
  const app = useApp();
  const insets = useSafeAreaInsets();

  function handleLogout() {
    app.currentUser?.logOut();
  }

  const paddingTop = insets.top + 32;

  return (
    <View style={{ paddingTop }} className="w-full p-8 bg-gray-700">
      <View className="flex-row justify-between items-center">
        <View className="flex-row gap-4">
          <Avatar>
            <AvatarImage
              source={{
                uri: user?.profile.pictureUrl,
              }}
            />
          </Avatar>

          <View>
            <Text className="text-gray-100">Olá,</Text>
            <Text className="text-gray-100 text-lg font-bold">
              {user?.profile.name}
            </Text>
          </View>
        </View>
        <TouchableOpacity activeOpacity={0.7} onPress={handleLogout}>
          <Ionicons name="exit-outline" size={24} color={colors.gray[100]} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
