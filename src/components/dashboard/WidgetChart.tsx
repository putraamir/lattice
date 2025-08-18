import { Trash2 } from "lucide-react-native";
import React from "react";
import { Dimensions, Text, View } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { IconButton } from "../ui";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface WidgetChartProps {
  widget: {
    id: string;
    title: string;
    data: any;
  };
  onDelete: () => void;
  isEditMode?: boolean;
}

export function WidgetChart({
  widget,
  onDelete,
  isEditMode = false,
}: WidgetChartProps) {
  const fallbackColors = [
    "#6366f1",
    "#8b5cf6",
    "#06b6d4",
    "#10b981",
    "#f59e0b",
  ];

  const getFallbackColor = (opacity = 1) => {
    const colorIndex = parseInt(widget.id) % fallbackColors.length;
    const color = fallbackColors[colorIndex];
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  const getColor = (opacity = 1) => {
    if (typeof widget.data.datasets[0].color === "function") {
      return widget.data.datasets[0].color(opacity);
    }
    return getFallbackColor(opacity);
  };

  return (
    <View className="bg-surface-primary border border-border-primary rounded-2xl mb-4 overflow-hidden">
      <View className="flex-row items-center justify-between px-6 py-4 border-b border-border-primary">
        <Text className="text-title-lg font-bold text-text-primary">
          {widget.title}
        </Text>
        {!isEditMode && (
          <IconButton
            icon={<Trash2 size={16} color="#ef4444" />}
            onPress={onDelete}
            variant="secondary"
          />
        )}
      </View>

      <View className="items-center p-4">
        <LineChart
          data={widget.data}
          width={SCREEN_WIDTH - 64}
          height={220}
          chartConfig={{
            backgroundColor: "#1b1e25",
            backgroundGradientFrom: "#1b1e25",
            backgroundGradientTo: "#242529",
            decimalPlaces: 0,
            color: (opacity = 1) => getColor(opacity),
            labelColor: (opacity = 1) => `rgba(161, 161, 170, ${opacity})`,
            style: {
              borderRadius: 12,
            },
            propsForDots: {
              r: "6",
              strokeWidth: "2",
              stroke: getColor(1),
            },
            propsForBackgroundLines: {
              strokeDasharray: "",
              stroke: "#27272a",
              strokeWidth: 1,
            },
          }}
          bezier
          style={{ borderRadius: 12 }}
        />
      </View>
    </View>
  );
}
