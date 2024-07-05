import { useEffect, useState } from "react";
import { Alert, FlatList, Text, View } from "react-native";

import { useNavigation } from "@react-navigation/native";

import { useQuery, useRealm } from "@/libs/realm";
import { Historic } from "@/libs/realm/schemas/Historic";

import { CarStatus } from "@/components/CarStatus";
import { HeaderHome } from "@/components/HeaderHome";
import { HistoricCard, HistoricCardProps } from "@/components/HistoricCard";
import dayjs from "dayjs";

export function Home() {
  const { navigate } = useNavigation();

  const realm = useRealm();
  const historic = useQuery(Historic);

  const [vehicleInUse, setVehicleInUse] = useState<Historic | null>(null);
  const [vehicleHistoric, setVehicleHistoric] = useState<HistoricCardProps[]>(
    []
  );

  function handleRegisterMovement() {
    if (vehicleInUse?._id) {
      return navigate("arrival", { id: vehicleInUse?._id.toString() });
    } else {
      navigate("departure");
    }
  }

  function fetchVehicleInUse() {
    try {
      const vehicle = historic.filtered("status = 'departure'")[0];

      setVehicleInUse(vehicle);
    } catch (err) {
      Alert.alert(
        "Veículo em uso",
        "Não foi possível carregar o veículo em uso."
      );

      console.error(err);
    }
  }

  function fetchHistoric() {
    try {
      const response = historic.filtered(
        "status = 'arrival' SORT(created_at DESC)"
      );

      const formattedHistoric = response.map((item) => {
        return {
          id: item._id!.toString(),
          created: dayjs(item.created_at).format(
            "[Saída em] DD/MM/YYYY [às] HH:mm"
          ),
          licensePlate: item.license_plate,
          isSync: false,
        };
      });

      setVehicleHistoric(formattedHistoric);
    } catch (error) {
      Alert.alert(
        "Histórico",
        "Não foi possível carregar o histórico de veículos."
      );

      console.error(error);
    }
  }

  function handleHistoricDetails(id: string) {
    navigate("arrival", { id });
  }

  useEffect(() => {
    fetchVehicleInUse();
  }, []);

  useEffect(() => {
    realm.addListener("change", () => fetchVehicleInUse());

    return () => {
      if (realm && !realm.isClosed) {
        realm.removeListener("change", fetchVehicleInUse);
      }
    };
  }, []);

  useEffect(() => {
    fetchHistoric();
  }, [historic]);

  return (
    <View className="flex-1 items-center bg-gray-800">
      <HeaderHome />

      <View className="w-full px-8">
        <CarStatus
          licensePlate={vehicleInUse?.license_plate}
          onPress={handleRegisterMovement}
        />

        <Text className="text-white text-lg font-bold mb-2">Histórico</Text>

        <FlatList
          data={vehicleHistoric}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <HistoricCard
              data={item}
              onPress={() => handleHistoricDetails(item.id)}
            />
          )}
          contentContainerClassName="mb-20"
          ListEmptyComponent={
            <View className="flex items-center justify-center mt-10">
              <Text className="text-gray-400">Nenhum veículo registrado.</Text>
            </View>
          }
        />
      </View>
    </View>
  );
}
