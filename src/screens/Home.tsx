import { useEffect, useState } from "react";
import { Alert, View } from "react-native";

import { useNavigation } from "@react-navigation/native";

import { useQuery, useRealm } from "@/lib/realm";
import { Historic } from "@/lib/realm/schemas/Historic";

import { CarStatus } from "@/components/CarStatus";
import { HeaderHome } from "@/components/HeaderHome";

export function Home() {
  const { navigate } = useNavigation();

  const realm = useRealm();
  const historic = useQuery(Historic);

  const [vehicleInUse, setVehicleInUse] = useState<Historic | null>(null);

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

  useEffect(() => {
    realm.addListener("change", () => fetchVehicleInUse());

    return () => {
      realm.removeListener("change", fetchVehicleInUse);
    };
  }, []);

  return (
    <View className="flex-1 items-center bg-gray-800">
      <HeaderHome />

      <View className="w-full px-8">
        <CarStatus
          licensePlate={vehicleInUse?.license_plate}
          onPress={handleRegisterMovement}
        />
      </View>
    </View>
  );
}
