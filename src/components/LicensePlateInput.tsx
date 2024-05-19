import { Text, TextInput, TextInputProps, View } from "react-native";

import { colors } from "@/styles/colors";

type LicensePlateInputProps = TextInputProps & {
  label: string;
};

export function LicensePlateInput({ label, ...rest }: LicensePlateInputProps) {
  return (
    <View className="w-full p-4 rounded-md bg-gray-700">
      <Text className="text-sm text-gray-200 font-light">{label}</Text>
      <TextInput
        className="text-gray-200 text-4xl text-center mt-4 font-bold"
        placeholderTextColor={colors.gray[400]}
        maxLength={7}
        autoCapitalize="characters"
        {...rest}
      />
    </View>
  );
}
