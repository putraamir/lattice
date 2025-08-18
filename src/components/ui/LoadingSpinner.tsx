import React from "react";
import { ActivityIndicator, Text, View } from "react-native";

interface LoadingSpinnerProps {
  message?: string;
  size?: "small" | "large";
  color?: string;
}

export function LoadingSpinner({
  message,
  size = "large",
  color = "#7C67BB",
}: LoadingSpinnerProps) {
  return (
    <View className="flex-1 justify-center items-center gap-4">
      <ActivityIndicator size={size} color={color} />
      {message && (
        <Text className="text-body-md text-text-primary">{message}</Text>
      )}
    </View>
  );
}
