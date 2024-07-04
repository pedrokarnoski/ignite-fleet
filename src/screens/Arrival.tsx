import { Alert, Text, View } from "react-native";

import { useNavigation, useRoute } from "@react-navigation/native";

import { Feather } from "@expo/vector-icons";

import { useObject, useRealm } from "@/lib/realm";
import { Historic } from "@/lib/realm/schemas/Historic";
import { BSON } from "realm";

import { Button } from "@/components/Button";
import { Header } from "@/components/Header";

import { colors } from "@/styles/colors";

type RouteParamsProps = {
  id: string;
};

export function Arrival() {
  const route = useRoute();

  const { id } = route.params as RouteParamsProps;
  const { goBack } = useNavigation();

  const realm = useRealm();
  const historic = useObject(Historic, new BSON.UUID(id));

  function handleRemoveVehicleUsage() {
    Alert.alert("Cancelar", "Cancelar a utilização do veículo?", [
      { text: "Não", style: "cancel" },
      { text: "Sim", onPress: () => removeVehicleUsage() },
    ]);
  }

  function removeVehicleUsage() {
    try {
      realm.write(() => {
        if (historic) {
          realm.delete(historic);
        }
      });

      goBack();
    } catch (error) {
      Alert.alert("Erro", "Não foi possível cancelar a utilização do veículo.");
    }
  }

  return (
    <View className="flex-1 bg-gray-800">
      <Header title="Chegada" />

      <View className="flex-grow p-8">
        <Text className="text-gray-300 text-sm mt-8 mb-1">
          Placa do veículo
        </Text>
        <Text className="text-gray-100 text-3xl font-bold">
          {historic?.license_plate}
        </Text>
        <Text className="text-gray-300 text-sm mt-8 mb-1">Finalidade</Text>
        <Text className="text-gray-100 text-md text-justify">
          {historic?.description}
        </Text>

        <View className="w-full flex-row mt-8 gap-4">
          <Button
            onPress={handleRemoveVehicleUsage}
            variant="icon"
            icon={<Feather name="x" size={24} color={colors["brand-light"]} />}
          />
          <View className="flex-1">
            <Button variant="default" label="Registrar chegada" />
          </View>
        </View>
      </View>
    </View>
  );
}
