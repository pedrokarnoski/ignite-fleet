import { forwardRef } from "react";
import { Text, TextInput, TextInputProps, View } from "react-native";

import { colors } from "@/styles/colors";

type TextAreaInputProps = TextInputProps & {
  label: string;
};

const TextAreaInput = forwardRef<TextInput, TextAreaInputProps>(
  ({ label, ...rest }, ref) => {
    return (
      <View className="w-full p-4 rounded-md h-40 bg-gray-700">
        <Text className="text-sm text-gray-200 font-light">{label}</Text>
        <TextInput
          ref={ref}
          className="text-gray-200 align-top mt-4"
          placeholderTextColor={colors.gray[400]}
          autoCapitalize="sentences"
          multiline
          {...rest}
        />
      </View>
    );
  }
);

export { TextAreaInput };
