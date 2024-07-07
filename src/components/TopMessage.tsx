import { Text, View } from "react-native";

import { colors } from "@/styles/colors";
import { Feather } from "@expo/vector-icons";

import { useSafeAreaInsets } from "react-native-safe-area-context";

type TopMessageProps = {
  icon?: keyof typeof Feather.glyphMap;
  title: string;
};

export function TopMessage({ icon, title }: TopMessageProps) {
  const insets = useSafeAreaInsets();

  const paddingTop = insets.top + 4;

  return (
    <View
      style={{ paddingTop }}
      className="flex-row items-center justify-center w-full absolute z-10 bg-gray-500 pb-1"
    >
      {icon && <Feather name={icon} color={colors.gray[200]} />}
      <Text className="text-gray-100 text-sm font-light ml-2">{title}</Text>
    </View>
  );
}
