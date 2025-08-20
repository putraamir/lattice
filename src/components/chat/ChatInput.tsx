import { Send } from "lucide-react-native";
import React from "react";
import { ActivityIndicator, View } from "react-native";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { IconButton, Input } from "../ui";

interface ChatInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  onFocus?: () => void;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  keyboardHeight: Animated.SharedValue<number>;
}

export function ChatInput({
  value,
  onChangeText,
  onSend,
  onFocus,
  onPress,
  disabled = false,
  loading = false,
  keyboardHeight,
}: ChatInputProps) {
  const insets = useSafeAreaInsets();

  const inputAreaAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY:
          keyboardHeight.value > 0
            ? -(keyboardHeight.value - insets.bottom - 85)
            : 0,
      },
    ],
  }));

  return (
    <Animated.View style={inputAreaAnimatedStyle}>
      <View className="px-6 py-4 bg-surface-primary border-t border-border-primary">
        <View className="flex-row items-center gap-3">
          <Input
            variant="chat"
            value={value}
            onChangeText={onChangeText}
            placeholder="Type your message..."
            multiline
            maxLength={1000}
            onPress={onPress}
            onFocus={onFocus}
          />
          <IconButton
            icon={
              loading ? (
                <ActivityIndicator size="small" color="#7C67BB" />
              ) : (
                <Send size={20} color={value.trim() ? "#FFFFFF" : "#7C67BB"} />
              )
            }
            onPress={onSend}
            disabled={!value.trim() || disabled || loading}
            variant="primary"
            size="lg"
            loading={loading}
          />
        </View>
      </View>
    </Animated.View>
  );
}
