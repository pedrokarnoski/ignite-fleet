import { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";

import { useNavigation } from "@react-navigation/native";

import { useQuery, useRealm } from "@/libs/realm";
import { Historic } from "@/libs/realm/schemas/Historic";

import { CarStatus } from "@/components/CarStatus";
import { HeaderHome } from "@/components/HeaderHome";
import { HistoricCard, HistoricCardProps } from "@/components/HistoricCard";
import { useToast } from "@/components/Toast";

import { TopMessage } from "@/components/TopMessage";
import {
  getLastSyncTimestamp,
  saveLastSyncTimestamp,
} from "@/libs/asyncStorage/syncStorage";
import { useUser } from "@realm/react";
import dayjs from "dayjs";
import Toast from "react-native-toast-message";
import { ProgressDirection, ProgressMode } from "realm";

export function Home() {
  const { toast } = useToast();
  const { navigate } = useNavigation();

  const realm = useRealm();
  const historic = useQuery(Historic);
  const user = useUser();

  const [vehicleInUse, setVehicleInUse] = useState<Historic | null>(null);
  const [vehicleHistoric, setVehicleHistoric] = useState<HistoricCardProps[]>(
    []
  );
  const [percentageToSync, setPercentageToSync] = useState<string | null>(null);

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
      toast("Não foi possível carregar o veículo em uso.", "destructive");

      console.error(err);
    }
  }

  async function fetchHistoric() {
    try {
      const response = historic.filtered(
        "status = 'arrival' SORT(created_at DESC)"
      );

      const lastSync = await getLastSyncTimestamp();
      const formattedHistoric = response.map((item) => {
        return {
          id: item._id!.toString(),
          created: dayjs(item.created_at).format(
            "[Saída em] DD/MM/YYYY [às] HH:mm"
          ),
          licensePlate: item.license_plate,
          isSync: lastSync > item.updated_at.getTime(),
        };
      });

      setVehicleHistoric(formattedHistoric);
    } catch (error) {
      console.error(error);
    }
  }

  function handleHistoricDetails(id: string) {
    navigate("arrival", { id });
  }

  async function progressNotification(
    transferred: number,
    transferable: number
  ) {
    const percentage = Math.round((transferred / transferable) * 100);

    if (percentage === 100) {
      await saveLastSyncTimestamp();

      await fetchHistoric();

      setPercentageToSync(null);

      Toast.show({
        type: "info",
        text1: "Todos os dados estão sincronizados.",
      });
    }

    if (percentage < 100) {
      setPercentageToSync(`${percentage.toFixed(0)}% sincronizado`);
    }
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

  useEffect(() => {
    realm.subscriptions.update((mutableSubs, realm) => {
      const historicByUserQuery = realm
        .objects<Historic>("Historic")
        .filtered(`user_id = "${user!.id}"`);

      mutableSubs.add(historicByUserQuery, { name: "historicByUser" });
    });
  }, [realm]);

  useEffect(() => {
    const syncSession = realm.syncSession;

    if (!syncSession) {
      return;
    }

    syncSession.addProgressNotification(
      ProgressDirection.Upload,
      ProgressMode.ReportIndefinitely,
      progressNotification
    );

    return () => {
      syncSession.removeProgressNotification(progressNotification);
    };
  }, [realm]);

  return (
    <View className="flex-1 items-center bg-gray-800">
      {percentageToSync && (
        <TopMessage icon="upload-cloud" title={percentageToSync} />
      )}

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
