import React from "react";
import { ActivityIndicator, TouchableOpacity } from "react-native";

interface IconButtonProps {
  icon: React.ReactNode;
  onPress: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "danger";
  loading?: boolean;
  size?: "sm" | "md" | "lg";
}

export function IconButton({
  icon,
  onPress,
  disabled = false,
  variant = "secondary",
  loading = false,
  size = "md",
}: IconButtonProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case "primary":
        return disabled || loading ? "bg-surface-secondary" : "bg-primary";
      case "secondary":
        return "bg-surface-secondary border border-border-primary";
      case "danger":
        return "bg-surface-secondary";
      default:
        return "bg-surface-secondary border border-border-primary";
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case "sm":
        return "w-8 h-8 rounded-lg";
      case "md":
        return "w-10 h-10 rounded-xl";
      case "lg":
        return "w-12 h-12 rounded-full";
      default:
        return "w-10 h-10 rounded-xl";
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      className={`justify-center items-center ${getVariantStyles()} ${getSizeStyles()}`}
    >
      {loading ? <ActivityIndicator size="small" color="#7C67BB" /> : icon}
    </TouchableOpacity>
  );
}
