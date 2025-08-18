import { Plus, TrendingUp } from "lucide-react-native";
import React from "react";
import { ScrollView, Text, View } from "react-native";
import { Button } from "../ui";

interface EmptyWidgetsProps {
  onCreateWidget: () => void;
}

export function EmptyWidgets({ onCreateWidget }: EmptyWidgetsProps) {
  return (
    <ScrollView
      className="flex-1"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <View className="px-6 py-6 bg-surface-primary mx-4 mt-4 rounded-xl">
        <View className="flex-row gap-3 flex-wrap">
          <Button
            title="Add Widget"
            onPress={onCreateWidget}
            icon={<Plus size={16} color="white" />}
          />
        </View>
      </View>

      <View className="items-center py-20 mx-4 gap-6">
        <View className="w-24 h-24 bg-surface-secondary rounded-2xl justify-center items-center">
          <TrendingUp size={48} color="#7C67BB" />
        </View>
        <View className="items-center gap-2">
          <Text className="text-title-lg font-bold text-text-primary">
            No Widgets Yet
          </Text>
          <Text className="text-body-md text-text-secondary text-center">
            Add your first widget to visualize data
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
