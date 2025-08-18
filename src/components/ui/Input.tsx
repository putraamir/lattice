import React from "react";
import { TextInput, TextInputProps } from "react-native";

interface InputProps extends TextInputProps {
  variant?: "default" | "chat";
}

export function Input({
  variant = "default",
  className,
  ...props
}: InputProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case "chat":
        return "flex-1 border border-border-secondary rounded-2xl px-5 py-4 max-h-32 text-body-md text-text-primary bg-surface-secondary focus:border-primary";
      case "default":
        return "border-2 border-border-primary rounded-2xl px-5 py-4 text-body-md text-text-primary bg-surface-primary focus:border-primary";
      default:
        return "border-2 border-border-primary rounded-2xl px-5 py-4 text-body-md text-text-primary bg-surface-primary focus:border-primary";
    }
  };

  return (
    <TextInput
      className={`${getVariantStyles()} ${className || ""}`}
      placeholderTextColor="#71717a"
      {...props}
    />
  );
}
