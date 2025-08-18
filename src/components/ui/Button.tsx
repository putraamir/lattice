import React from "react";
import { ActivityIndicator, Text, TouchableOpacity } from "react-native";

interface ButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "danger";
  loading?: boolean;
  size?: "sm" | "md" | "lg" | "full";
  icon?: React.ReactNode;
}

export function Button({
  title,
  onPress,
  disabled = false,
  variant = "primary",
  loading = false,
  size = "md",
  icon,
}: ButtonProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case "primary":
        return disabled || loading ? "bg-surface-secondary" : "bg-primary";
      case "secondary":
        return "bg-surface-secondary border border-border-primary";
      case "danger":
        return disabled || loading ? "bg-surface-secondary" : "bg-red-500";
      default:
        return "bg-primary";
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case "sm":
        return "px-3 py-2 rounded-lg";
      case "md":
        return "px-4 py-3 rounded-xl";
      case "lg":
        return "px-8 py-4 rounded-2xl";
      case "full":
        return "px-4 py-3 rounded-xl flex flex-1";
      default:
        return "px-4 py-3 rounded-xl";
    }
  };

  const getTextStyles = () => {
    const baseStyles = "font-semibold";
    const colorStyles =
      variant === "secondary" ? "text-text-secondary" : "text-white";
    const sizeStyles = size === "lg" ? "text-title-md" : "text-label-lg";
    return `${baseStyles} ${colorStyles} ${sizeStyles}`;
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      className={`flex-row items-center justify-center gap-2 ${getVariantStyles()} ${getSizeStyles()}`}
    >
      {loading ? (
        <ActivityIndicator size="small" color="#7C67BB" />
      ) : (
        <>
          {icon}
          <Text className={getTextStyles()}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
}
