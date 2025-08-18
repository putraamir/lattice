import React from "react";
import { Text, TouchableOpacity } from "react-native";

interface DashboardTabProps {
  dashboard: {
    id: string;
    name: string;
  };
  isSelected: boolean;
  onPress: () => void;
}

export function DashboardTab({
  dashboard,
  isSelected,
  onPress,
}: DashboardTabProps) {
  return (
    <TouchableOpacity
      className={`px-5 py-3 rounded-xl mr-3 border ${
        isSelected
          ? "bg-primary border-primary"
          : "bg-surface-secondary border-border-primary"
      }`}
      onPress={onPress}
    >
      <Text
        className={`text-label-lg font-semibold ${
          isSelected ? "text-white" : "text-text-secondary"
        }`}
      >
        {dashboard.name}
      </Text>
    </TouchableOpacity>
  );
}
