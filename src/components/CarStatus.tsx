import {
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from "react-native";

import { colors } from "@/styles/colors";
import { Ionicons } from "@expo/vector-icons";

type CarStatusProps = TouchableOpacityProps & {
  licensePlate?: string;
};

export function CarStatus({ licensePlate, ...rest }: CarStatusProps) {
  return (
    <TouchableOpacity {...rest} activeOpacity={0.7}>
      <View className="w-full flex-row items-center my-8 p-4 rounded-md bg-gray-700">
        <View className="w-20 h-20 rounded-md bg-gray-600 mr-3 justify-center items-center">
          <Ionicons
            name={licensePlate ? "car" : "key"}
            size={48}
            color={colors["brand-light"]}
          />
        </View>

        <Text className="flex-1 pl-2 text-gray-100">
          {licensePlate
            ? `Veículo ${licensePlate} em uso. `
            : "Nenhum veículo em uso. "}

          <Text className="text-brand-light font-bold">
            Clique aqui para registrar a {licensePlate ? "chegada" : "saída"}
          </Text>
        </Text>
      </View>
    </TouchableOpacity>
  );
}
