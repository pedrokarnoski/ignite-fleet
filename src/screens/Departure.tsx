import { useRef } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { Button } from "@/components/Button";
import { Header } from "@/components/Header";
import { LicensePlateInput } from "@/components/LicensePlateInput";
import { TextAreaInput } from "@/components/TextAreaInput";

export function Departure() {
  const descriptionRef = useRef<TextInput>(null);

  function handleDepartureRegister() {
    console.log("Registrar saída");
  }

  return (
    <View className="flex-1 bg-gray-800">
      <Header title="Saída" />

      <KeyboardAvoidingView
        behavior={Platform.OS === "android" ? "height" : "position"}
      >
        <ScrollView>
          <View className="w-full gap-4 p-8">
            <LicensePlateInput
              label="Placa do veículo"
              placeholder="BRA1234"
              onSubmitEditing={() => descriptionRef.current?.focus()}
              returnKeyType="next"
            />
            <TextAreaInput
              ref={descriptionRef}
              label="Finalidade"
              placeholder="Vou utilizar o veículo para..."
              onSubmitEditing={handleDepartureRegister}
              returnKeyType="send"
              blurOnSubmit
            />

            <Button
              label="Registrar saída"
              icon={<Ionicons name="checkmark-done" size={20} color="white" />}
              onPress={handleDepartureRegister}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
