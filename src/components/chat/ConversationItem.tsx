import { formatTimestamp, getUserInitials } from "@/lib/utils/utils";
import { Trash2 } from "lucide-react-native";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface ConversationItemProps {
  conversation: {
    id: string;
    title: string;
    messages: { content: string; timestamp: string | Date }[];
    createdAt: string | Date;
  };
  isSelected: boolean;
  onPress: () => void;
  onDelete: () => void;
}

export function ConversationItem({
  conversation,
  isSelected,
  onPress,
  onDelete,
}: ConversationItemProps) {
  const lastMessage = conversation.messages[conversation.messages.length - 1];
  const initials = getUserInitials(conversation.title);

  return (
    <TouchableOpacity
      className={`mx-3 mb-3 p-4 rounded-xl border ${
        isSelected
          ? "bg-surface-tertiary border-primary"
          : "bg-surface-primary border-border-primary"
      }`}
      onPress={onPress}
    >
      <View className="flex-row items-start gap-3">
        <View
          className={`w-12 h-12 rounded-full items-center justify-center ${
            isSelected ? "bg-primary" : "bg-surface-secondary"
          }`}
        >
          <Text
            className={`text-title-sm font-semibold ${
              isSelected ? "text-white" : "text-text-primary"
            }`}
          >
            {initials}
          </Text>
        </View>

        <View className="flex-1 min-w-0">
          <View className="flex-row items-center justify-between mb-1">
            <Text
              className={`text-title-md font-semibold flex-1 ${
                isSelected ? "text-text-primary" : "text-text-primary"
              }`}
              numberOfLines={1}
            >
              {conversation.title}
            </Text>
            <Text className="text-label-sm text-text-tertiary ml-2">
              {formatTimestamp(
                lastMessage?.timestamp || conversation.createdAt
              )}
            </Text>
          </View>

          <Text
            className="text-body-sm text-text-secondary leading-5 mb-2"
            numberOfLines={2}
          >
            {lastMessage?.content || "No messages yet"}
          </Text>

          <View className="flex-row items-center justify-end">
            <TouchableOpacity
              onPress={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="p-1 rounded-md"
            >
              <Trash2 size={16} color="#71717a" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
