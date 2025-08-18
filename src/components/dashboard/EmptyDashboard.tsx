import {
  Activity,
  BarChart3,
  PieChart,
  Plus,
  TrendingUp,
} from "lucide-react-native";
import React from "react";
import { Text, View } from "react-native";
import { Button } from "../ui";

interface EmptyDashboardProps {
  onCreateDashboard: () => void;
}

export function EmptyDashboard({ onCreateDashboard }: EmptyDashboardProps) {
  return (
    <View className="flex-1 justify-center items-center px-8 gap-8">
      <View className="items-center gap-4">
        <View className="relative">
          <View className="w-32 h-32 bg-surface-secondary rounded-3xl justify-center items-center">
            <Activity size={64} color="#7C67BB" />
          </View>
          <View className="absolute -top-2 -right-2 w-8 h-8 bg-primary rounded-full justify-center items-center">
            <Plus size={16} color="white" />
          </View>
          <View className="absolute -bottom-2 -left-2 w-8 h-8 bg-primary rounded-full justify-center items-center">
            <BarChart3 size={16} color="white" />
          </View>
          <View className="absolute top-6 -right-8 w-6 h-6 bg-primary rounded-full justify-center items-center">
            <PieChart size={12} color="white" />
          </View>
        </View>
      </View>

      <View className="items-center gap-3">
        <Text className="text-headline-lg font-bold text-text-primary text-center">
          Create Your First Dashboard
        </Text>
        <Text className="text-body-lg text-text-secondary text-center leading-7 max-w-sm">
          Transform your data into beautiful visualizations and gain valuable
          insights with custom dashboards
        </Text>
      </View>

      <Button
        title="Create Dashboard"
        onPress={onCreateDashboard}
        size="lg"
        icon={<Plus size={20} color="white" />}
      />

      <View className="flex-row justify-center gap-8 mt-4">
        <View className="items-center gap-2">
          <View className="w-10 h-10 bg-surface-secondary rounded-xl justify-center items-center">
            <TrendingUp size={20} color="#7C67BB" />
          </View>
          <Text className="text-label-md text-text-tertiary">Analytics</Text>
        </View>
        <View className="items-center gap-2">
          <View className="w-10 h-10 bg-surface-secondary rounded-xl justify-center items-center">
            <BarChart3 size={20} color="#7C67BB" />
          </View>
          <Text className="text-label-md text-text-tertiary">Reports</Text>
        </View>
        <View className="items-center gap-2">
          <View className="w-10 h-10 bg-surface-secondary rounded-xl justify-center items-center">
            <PieChart size={20} color="#7C67BB" />
          </View>
          <Text className="text-label-md text-text-tertiary">Insights</Text>
        </View>
      </View>
    </View>
  );
}
