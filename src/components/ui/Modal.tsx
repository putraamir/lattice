import React from "react";
import { Modal as RNModal, Text, View } from "react-native";

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Modal({ visible, onClose, title, children }: ModalProps) {
  return (
    <RNModal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/70 justify-center items-center px-6">
        <View className="w-full max-w-sm bg-background-tertiary rounded-3xl p-8 border border-border-primary">
          <Text className="text-headline-sm font-bold text-text-primary mb-8 text-center">
            {title}
          </Text>
          {children}
        </View>
      </View>
    </RNModal>
  );
}
