import { Send } from "lucide-react-native";
import React from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  View,
} from "react-native";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
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
  const inputAreaAnimatedStyle = useAnimatedStyle(() => ({
    paddingBottom: Platform.OS === "android" ? keyboardHeight.value - 60 : 0,
  }));

  return (
    <Animated.View style={inputAreaAnimatedStyle}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 88 : 0}
      >
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
      </KeyboardAvoidingView>
    </Animated.View>
  );
}
