import { Bot } from "lucide-react-native";
import React from "react";
import { Text, View } from "react-native";

interface ThinkingMessageProps {
  displayContent?: string;
  isTyping?: boolean;
}

export function ThinkingMessage({
  displayContent,
  isTyping = false,
}: ThinkingMessageProps) {
  return (
    <View className="px-6 py-2 items-start">
      <View className="max-w-[85%] px-5 py-4 rounded-2xl my-1 bg-surface-primary border border-border-primary rounded-bl-md">
        <View className="flex-row items-center mb-2">
          <Bot size={14} color="#7C67BB" />
          <Text className="text-label-sm ml-2 font-medium text-primary">
            AI Assistant
          </Text>
        </View>
        <View className="flex-row items-center">
          {displayContent ? (
            <>
              <Text className="text-body-md leading-6 text-text-primary">
                {displayContent}
              </Text>
              {isTyping && (
                <Text className="text-text-primary animate-pulse ml-1">|</Text>
              )}
            </>
          ) : (
            <>
              <Text className="text-body-md text-text-primary mr-2">
                Thinking
              </Text>
              <View className="flex-row">
                <Text className="text-body-md text-text-primary animate-pulse">
                  .
                </Text>
                <Text className="text-body-md text-text-primary animate-pulse">
                  .
                </Text>
                <Text className="text-body-md text-text-primary animate-pulse">
                  .
                </Text>
              </View>
            </>
          )}
        </View>
        {displayContent && (
          <Text className="text-label-sm mt-2 text-text-tertiary">
            {new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        )}
      </View>
    </View>
  );
}
