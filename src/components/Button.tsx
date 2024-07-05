import { colors } from "@/styles/colors";

import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../libs/utils";

const buttonVariants = cva(
  "flex flex-row items-center justify-center rounded-md",
  {
    variants: {
      variant: {
        default: "bg-brand-mid h-14 px-4",
        icon: "h-14 w-14 bg-gray-600",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const buttonTextVariants = cva("text-center font-medium", {
  variants: {
    variant: {
      default: "text-white",
      icon: "text-green-500",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

interface ButtonProps
  extends React.ComponentPropsWithoutRef<typeof TouchableOpacity>,
    VariantProps<typeof buttonVariants> {
  label?: string;
  labelClasses?: string;
  isLoading?: boolean;
  icon?: JSX.Element;
}
function Button({
  label,
  labelClasses,
  className,
  variant,
  isLoading,
  icon,
  ...props
}: ButtonProps) {
  return (
    <TouchableOpacity activeOpacity={0.7} disabled={isLoading} {...props}>
      <View
        className={cn(
          buttonVariants({ variant, className }),
          isLoading ? "opacity-50" : "opacity-100"
        )}
      >
        {isLoading ? (
          <ActivityIndicator color={colors.white} size="small" />
        ) : (
          <View className="flex-row gap-2">
            {icon && icon}
            {variant === "default" && (
              <Text
                className={cn(
                  buttonTextVariants({
                    variant,
                    className: labelClasses,
                  })
                )}
              >
                {label}
              </Text>
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

export { Button, buttonTextVariants, buttonVariants };
