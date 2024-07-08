import { useNavigation } from "@react-navigation/native";
import { useEffect, useRef, useState } from "react";
import { ScrollView, Text, TextInput, View } from "react-native";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { useRealm } from "@/libs/realm";
import { Historic } from "@/libs/realm/schemas/Historic";
import { useUser } from "@realm/react";

import { Ionicons } from "@expo/vector-icons";

import { Button } from "@/components/Button";
import { Header } from "@/components/Header";
import { LicensePlateInput } from "@/components/LicensePlateInput";
import { TextAreaInput } from "@/components/TextAreaInput";

import { useToast } from "@/components/Toast";
import { colors } from "@/styles/colors";
import { validateLicensePlate } from "@/utils/validateLicensePlate";
import { useForegroundPermissions } from "expo-location";

export function Departure() {
  const { toast } = useToast();

  const descriptionRef = useRef<TextInput>(null);
  const licensePlateRef = useRef<TextInput>(null);

  const realm = useRealm();
  const user = useUser();

  const { goBack } = useNavigation();

  const [locationForegroundPermission, requestLocationForegroundPermission] =
    useForegroundPermissions();
  const [description, setDescription] = useState("");
  const [licensePlate, setLicensePlate] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  function handleDepartureRegister() {
    try {
      if (!validateLicensePlate(licensePlate)) {
        licensePlateRef.current?.focus();

        return toast(
          "A placa é inválida. Por favor, verifique a placa do veículo.",
          "destructive"
        );
      }

      if (description.trim().length === 0) {
        return toast(
          "Por favor, informe a finalidade da utilização do veículo.",
          "destructive"
        );
      }

      setIsRegistering(true);

      realm.write(() => {
        realm.create(
          "Historic",
          Historic.generate({
            user_id: user!.id,
            license_plate: licensePlate.toUpperCase(),
            description,
          })
        );
      });

      toast("Saída do veículo registrada!", "success");

      goBack();
    } catch (err) {
      console.error(err);

      setIsRegistering(false);

      toast("Não foi possível registrar a saída do veículo.", "destructive");
    }
  }

  useEffect(() => {
    requestLocationForegroundPermission();
  }, []);

  if (!locationForegroundPermission?.granted) {
    return (
      <View className="flex-1 bg-gray-800">
        <Header title="Saída" />

        <View className="flex-1 items-center justify-center">
          <Ionicons name="location" size={52} color={colors["brand-light"]} />
          <Text className="text-white text-center m-4">
            Para registrar a saída do veículo, precisamos da sua permissão para
            acessar a localização.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-800">
      <Header title="Saída" />

      <KeyboardAwareScrollView extraHeight={80}>
        <ScrollView>
          <View className="w-full gap-4 p-8">
            <LicensePlateInput
              ref={licensePlateRef}
              label="Placa do veículo"
              placeholder="BRA1234"
              onSubmitEditing={() => descriptionRef.current?.focus()}
              onChangeText={setLicensePlate}
              returnKeyType="next"
            />

            <TextAreaInput
              ref={descriptionRef}
              label="Finalidade"
              placeholder="Vou utilizar o veículo para..."
              onSubmitEditing={handleDepartureRegister}
              onChangeText={setDescription}
              returnKeyType="send"
              blurOnSubmit
            />

            <Button
              variant="default"
              label="Registrar saída"
              isLoading={isRegistering}
              icon={<Ionicons name="checkmark-done" size={20} color="white" />}
              onPress={handleDepartureRegister}
            />
          </View>
        </ScrollView>
      </KeyboardAwareScrollView>
    </View>
  );
}
