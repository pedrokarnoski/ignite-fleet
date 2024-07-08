import React from "react";
import { View } from "react-native";

import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/libs/utils";
import { colors } from "@/styles/colors";
import { FontAwesome6 } from "@expo/vector-icons";

const sizeVariants = cva("flex", {
  variants: {
    size: {
      SMALL: "w-8 h-8",
      LARGE: "w-12 h-12",
    },
  },
  defaultVariants: {
    size: "LARGE",
  },
});

type IconBoxProps = {
  size: VariantProps<typeof sizeVariants>["size"];
  icon: React.ReactNode;
};

export function IconBox({ size, icon }: IconBoxProps) {
  return (
    <View
      className={cn(
        sizeVariants({ size }),
        "rounded-md bg-gray-700 justify-center items-center mr-3"
      )}
    >
      <FontAwesome6
        name={icon}
        size={size === "LARGE" ? 20 : 14}
        color={colors["brand-light"]}
      />
    </View>
  );
}
