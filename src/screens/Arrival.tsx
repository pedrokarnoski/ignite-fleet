import { useEffect, useState } from "react";
import { Alert, Text, View } from "react-native";

import dayjs from "dayjs";

import { useNavigation, useRoute } from "@react-navigation/native";
import { LatLng } from "react-native-maps";

import { Feather } from "@expo/vector-icons";

import {
  getStorageLocations,
  removeStorageLocations,
} from "@/libs/asyncStorage/locationStorage";
import { getLastSyncTimestamp } from "@/libs/asyncStorage/syncStorage";
import { useObject, useRealm } from "@/libs/realm";
import { Historic } from "@/libs/realm/schemas/Historic";

import { stopLocationTask } from "@/tasks/backgroundLocationTask";
import { getAddressLocation } from "@/utils/getAddressLocation";

import { BSON } from "realm";

import { Button } from "@/components/Button";
import { Header } from "@/components/Header";
import { LocationInfoProps } from "@/components/LocationInfo";
import { Locations } from "@/components/Locations";
import { Map } from "@/components/Map";
import { useToast } from "@/components/Toast";

import { colors } from "@/styles/colors";

type RouteParamsProps = {
  id: string;
};

export function Arrival() {
  const [dataNotSynced, setDataNotSynced] = useState(false);
  const [coords, setCoords] = useState<LatLng[]>([]);
  const [departure, setDeparture] = useState<LocationInfoProps>(
    {} as LocationInfoProps
  );
  const [arrival, setArrival] = useState<LocationInfoProps | null>(null);

  const route = useRoute();
  const { toast } = useToast();

  const { id } = route.params as RouteParamsProps;
  const { goBack } = useNavigation();

  const realm = useRealm();
  const historic = useObject(Historic, new BSON.UUID(id));

  const title = historic?.status === "departure" ? "Chegada" : "Detalhes";

  function handleRemoveVehicleUsage() {
    Alert.alert("Cancelar", "Cancelar a utilização do veículo?", [
      { text: "Não", style: "cancel" },
      { text: "Sim", onPress: () => removeVehicleUsage() },
    ]);
  }

  async function removeVehicleUsage() {
    try {
      realm.write(() => {
        if (historic) {
          realm.delete(historic);
        }
      });

      await removeStorageLocations();

      goBack();
    } catch (error) {
      toast(
        "Não foi possível cancelar a utilização do veículo.",
        "destructive"
      );
    }
  }

  async function handleArrivalRegister() {
    try {
      if (!historic) {
        throw new Error("Veículo não encontrado.");
      }

      const locations = await getStorageLocations();

      realm.write(() => {
        if (historic) {
          historic.status = "arrival";
          historic.updated_at = new Date();
          historic.coords.push(...locations);
        }
      });

      await stopLocationTask();

      toast("Chegada registrada com sucesso.", "success");

      goBack();
    } catch (error) {
      toast("Não foi possível registrar a chegada do veículo.", "destructive");
    }
  }

  async function getLocationsInfo() {
    if (!historic) return;

    const lastSync = await getLastSyncTimestamp();
    const updatedAt = historic!.updated_at.getTime();

    setDataNotSynced(updatedAt > lastSync);

    if (historic?.status === "departure") {
      const locationsStorage = await getStorageLocations();
      setCoords(locationsStorage);
    } else {
      const coords = historic?.coords.map((coord) => ({
        latitude: coord.latitude,
        longitude: coord.longitude,
      }));

      setCoords(coords ?? []);
    }

    if (historic?.coords[0]) {
      const departureStreetName = await getAddressLocation(historic?.coords[0]);

      setDeparture({
        label: `Saindo em ${departureStreetName ?? ""}`,
        description: dayjs(new Date(historic?.coords[0].timestamp)).format(
          "DD/MM/YYYY [às] HH:mm"
        ),
      });
    }

    if (historic?.status === "arrival") {
      const lastLocation = historic?.coords[historic?.coords.length - 1];
      const arrivalStreetName = await getAddressLocation(lastLocation);

      setArrival({
        label: `Chegando em ${arrivalStreetName ?? ""}`,
        description: dayjs(new Date(lastLocation.timestamp)).format(
          "DD/MM/YYYY [às] HH:mm"
        ),
      });
    }
  }

  useEffect(() => {
    getLocationsInfo();
  }, [historic]);

  return (
    <View className="flex-1 bg-gray-800">
      <Header title={title} />

      {coords?.length > 0 && <Map coords={coords} />}

      <View className="flex-grow p-8">
        <Locations departure={departure} arrival={arrival} />

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
      </View>

      {historic?.status === "departure" && (
        <View className="w-full flex-row p-8 mt-8 gap-4">
          <Button
            onPress={handleRemoveVehicleUsage}
            variant="icon"
            icon={<Feather name="x" size={24} color={colors["brand-light"]} />}
          />
          <View className="flex-1">
            <Button
              onPress={handleArrivalRegister}
              variant="default"
              label="Registrar chegada"
            />
          </View>
        </View>
      )}

      {dataNotSynced && (
        <Text className="text-gray-300 text-sm text-center mb-6">
          Sincronização da{" "}
          {historic?.status === "departure" ? "partida" : "chegada"} pendente
        </Text>
      )}
    </View>
  );
}
