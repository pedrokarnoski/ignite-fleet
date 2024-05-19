import { useNavigation } from "@react-navigation/native";
import { View } from "react-native";

import { CarStatus } from "@/components/CarStatus";
import { HeaderHome } from "@/components/HeaderHome";

export function Home() {
  const { navigate } = useNavigation();

  function handleRegisterMovement() {
    navigate("departure");
  }

  return (
    <View className="flex-1 items-center bg-gray-800">
      <HeaderHome />

      <View className="w-full px-8">
        <CarStatus onPress={handleRegisterMovement} />
      </View>
    </View>
  );
}
