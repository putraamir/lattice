import { Bot, User } from "lucide-react-native";
import React from "react";
import { Dimensions, Text, View } from "react-native";
import { LineChart } from "react-native-chart-kit";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface MessageBubbleProps {
  message: {
    id: string;
    content: string;
    role: "user" | "assistant";
    timestamp: string | Date;
    chartData?: ChartData;
  };
  displayText?: string;
  isTyping?: boolean;
}

export function MessageBubble({
  message,
  displayText,
  isTyping = false,
}: MessageBubbleProps) {
  const content = displayText || message.content;

  const parseMarkdown = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        const boldText = part.slice(2, -2);
        return (
          <Text
            key={index}
            className={`font-bold ${
              message.role === "user" ? "text-white" : "text-text-primary"
            }`}
          >
            {boldText}
          </Text>
        );
      }
      return part;
    });
  };

  const fallbackColors = [
    "#6366f1",
    "#8b5cf6",
    "#06b6d4",
    "#10b981",
    "#f59e0b",
  ];

  const getFallbackColor = (opacity = 1) => {
    const colorIndex = parseInt(message.id) % fallbackColors.length;
    const color = fallbackColors[colorIndex];
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  const getColor = (opacity = 1) => {
    if (
      message.chartData?.datasets?.[0]?.color &&
      typeof message.chartData.datasets[0].color === "function"
    ) {
      return message.chartData.datasets[0].color(opacity);
    }
    return getFallbackColor(opacity);
  };

  return (
    <View
      className={`px-6 py-2 ${
        message.role === "user" ? "items-end" : "items-start"
      }`}
    >
      <View
        className={`${message.chartData ? "max-w-[95%]" : "max-w-[85%]"} px-5 py-4 rounded-2xl my-1 ${
          message.role === "user"
            ? "bg-primary rounded-br-md"
            : "bg-surface-primary border border-border-primary rounded-bl-md"
        }`}
      >
        <View className="flex-row items-center mb-2">
          {message.role === "user" ? (
            <User size={14} color="white" />
          ) : (
            <Bot size={14} color="#7C67BB" />
          )}
          <Text
            className={`text-label-sm ml-2 font-medium ${
              message.role === "user" ? "text-white/80" : "text-primary"
            }`}
          >
            {message.role === "user" ? "You" : "Financial AI"}
          </Text>
        </View>
        <Text
          className={`text-body-md leading-6  ${
            message.role === "user" ? "text-white" : "text-text-primary"
          }`}
        >
          {parseMarkdown(content)}
        </Text>
        {isTyping && (
          <Text className="text-text-primary animate-pulse ml-1">|</Text>
        )}

        {message.chartData && message.role === "assistant" && (
          <View className="mt-4 items-center">
            <LineChart
              data={message.chartData}
              width={Math.min(SCREEN_WIDTH - 80, 320)}
              height={200}
              chartConfig={{
                backgroundColor: "#1b1e25",
                backgroundGradientFrom: "#1b1e25",
                backgroundGradientTo: "#242529",
                decimalPlaces: 0,
                color: (opacity = 1) => getColor(opacity),
                labelColor: (opacity = 1) => `rgba(161, 161, 170, ${opacity})`,
                style: {
                  borderRadius: 8,
                },
                propsForDots: {
                  r: "4",
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
              style={{
                borderRadius: 8,
                marginVertical: 8,
              }}
            />
          </View>
        )}

        <Text
          className={`text-label-sm mt-2 ${
            message.role === "user" ? "text-white/60" : "text-text-tertiary"
          }`}
        >
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </View>
    </View>
  );
}
