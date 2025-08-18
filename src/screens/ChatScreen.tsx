import { Menu, Plus } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Keyboard,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  clearInputText,
  setInputText,
  setSelectedConversation,
  setSidebarOpen,
} from "@/lib/store/slices/uiSlice";
import { useTRPC } from "@/lib/utils/trpc";
import {
  ChatInput,
  ConversationItem,
  LoadingSpinner,
  MessageBubble,
  ThinkingMessage,
} from "@/src/components";
import { useMutation, useQuery } from "@tanstack/react-query";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const SIDEBAR_WIDTH = SCREEN_WIDTH * 0.8;

export default function ChatScreen() {
  const dispatch = useAppDispatch();
  const trpc = useTRPC();

  const { sidebarOpen, inputText, selectedConversationId } = useAppSelector(
    (state) =>
      state.ui as {
        sidebarOpen: boolean;
        inputText: string;
        selectedConversationId: string | null;
      }
  );

  const sidebarX = useSharedValue(0);
  const keyboardHeight = useSharedValue(0);
  const flatListRef = useRef<FlatList>(null);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [thinkingMessageId, setThinkingMessageId] = useState<string | null>(
    null
  );
  const [typewriterMessages, setTypewriterMessages] = useState<{
    [key: string]: string;
  }>({});
  const [aiResponseContent, setAiResponseContent] = useState<{
    [key: string]: string;
  }>({});

  const conversationsQuery = useQuery(trpc.conversations.getAll.queryOptions());
  const selectedConversation = useQuery({
    ...trpc.conversations.getById.queryOptions({
      id: selectedConversationId || "",
    }),
    enabled: !!selectedConversationId,
  });

  const sendMessageMutation = useMutation(
    trpc.conversations.sendMessage.mutationOptions({
      onMutate: (variables) => {
        dispatch(clearInputText());
        return { userMessageContent: variables.content };
      },
      onSuccess: (data, variables, context) => {
        conversationsQuery.refetch();
        selectedConversation.refetch();

        setTimeout(() => {
          const tempMessageId = `thinking-${Date.now()}`;
          setThinkingMessageId(tempMessageId);
          setIsAiThinking(true);

          setTimeout(() => {
            sendAiResponseMutation.mutate({
              conversationId: selectedConversationId!,
              userMessage: context?.userMessageContent || "",
            });
          }, 1500);
        }, 800);
      },
      onError: () => {
        setIsAiThinking(false);
      },
    })
  );

  const sendAiResponseMutation = useMutation(
    trpc.conversations.sendAiResponse.mutationOptions({
      onSuccess: (data) => {
        if (data.aiMessage && thinkingMessageId) {
          setAiResponseContent((prev) => ({
            ...prev,
            [thinkingMessageId]: data.aiMessage.content,
          }));
          startTypewriterEffectOnThinkingMessage(
            thinkingMessageId,
            data.aiMessage.content
          );
        }
      },
      onError: () => {
        setIsAiThinking(false);
        setThinkingMessageId(null);
      },
    })
  );

  const deleteConversationMutation = useMutation(
    trpc.conversations.delete.mutationOptions({
      onSuccess: () => {
        conversationsQuery.refetch();
        const remainingConversations = conversationsQuery.data?.filter(
          (c) => c.id !== selectedConversationId
        );
        if (remainingConversations && remainingConversations.length > 0) {
          dispatch(setSelectedConversation(remainingConversations[0].id));
        } else {
          dispatch(setSelectedConversation(""));
        }
      },
    })
  );

  const createConversationMutation = useMutation(
    trpc.conversations.create.mutationOptions({
      onSuccess: (newConversation) => {
        conversationsQuery.refetch();
        dispatch(setSelectedConversation(newConversation.id));
      },
    })
  );

  useEffect(() => {
    if (
      !selectedConversationId &&
      conversationsQuery.data &&
      conversationsQuery.data.length > 0
    ) {
      dispatch(setSelectedConversation(conversationsQuery.data[0].id));
    }
  }, [conversationsQuery.data, selectedConversationId, dispatch]);

  useEffect(() => {
    if (flatListRef.current) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [selectedConversation.data?.messages, isAiThinking]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      (e) => {
        keyboardHeight.value = withTiming(e.endCoordinates.height, {
          duration: 250,
        });

        flatListRef.current?.scrollToEnd({ animated: true });
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        keyboardHeight.value = withTiming(0, {
          duration: 250,
        });
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, [keyboardHeight]);

  const openSidebar = () => {
    dispatch(setSidebarOpen(true));
    sidebarX.value = withTiming(SIDEBAR_WIDTH, { duration: 300 });
  };

  const closeSidebar = () => {
    dispatch(setSidebarOpen(false));
    sidebarX.value = withTiming(0, { duration: 300 });
  };

  const setSidebarState = (isOpen: boolean) => {
    dispatch(setSidebarOpen(isOpen));
  };

  const panGesture = Gesture.Pan()
    .activeOffsetX([-30, 30])
    .failOffsetY([-15, 15])
    .minDistance(20)
    .simultaneousWithExternalGesture()
    .onUpdate((event) => {
      const isStronglyHorizontalGesture =
        Math.abs(event.translationX) > Math.abs(event.translationY) * 3 &&
        Math.abs(event.translationX) > 30;

      if (!isStronglyHorizontalGesture) return;

      if (sidebarOpen) {
        if (event.translationX < 0) {
          const newX = Math.max(0, SIDEBAR_WIDTH + event.translationX);
          sidebarX.value = newX;
        }
      } else {
        if (event.translationX > 0) {
          const newX = Math.min(SIDEBAR_WIDTH, event.translationX);
          sidebarX.value = newX;
        }
      }
    })
    .onEnd((event) => {
      const isStronglyHorizontalGesture =
        Math.abs(event.translationX) > Math.abs(event.translationY) * 3 &&
        Math.abs(event.translationX) > 30;
      const hasSignificantMovement = Math.abs(event.translationX) > 60;
      const hasSignificantVelocity = Math.abs(event.velocityX) > 300;

      if (
        !isStronglyHorizontalGesture ||
        (!hasSignificantMovement && !hasSignificantVelocity)
      ) {
        if (sidebarOpen) {
          sidebarX.value = withTiming(SIDEBAR_WIDTH, { duration: 200 });
        } else {
          sidebarX.value = withTiming(0, { duration: 200 });
        }
        return;
      }

      if (sidebarOpen) {
        const shouldClose =
          event.translationX < -SIDEBAR_WIDTH / 3 || event.velocityX < -300;
        if (shouldClose) {
          const duration = Math.max(150, 400 - Math.abs(event.velocityX) / 8);
          sidebarX.value = withTiming(0, { duration });
          runOnJS(setSidebarState)(false);
        } else {
          const duration = Math.max(100, 300 - Math.abs(event.velocityX) / 10);
          sidebarX.value = withTiming(SIDEBAR_WIDTH, { duration });
        }
      } else {
        const shouldOpen =
          event.translationX > SIDEBAR_WIDTH / 3 || event.velocityX > 300;
        if (shouldOpen) {
          const duration = Math.max(150, 400 - Math.abs(event.velocityX) / 8);
          sidebarX.value = withTiming(SIDEBAR_WIDTH, { duration });
          runOnJS(setSidebarState)(true);
        } else {
          sidebarX.value = withTiming(0, { duration: 200 });
        }
      }
    });

  const sidebarAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: sidebarX.value - SIDEBAR_WIDTH }],
  }));

  const mainContentAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: sidebarX.value }],
  }));

  const startTypewriterEffectOnThinkingMessage = (
    messageId: string,
    fullText: string
  ) => {
    setTypewriterMessages((prev) => ({ ...prev, [messageId]: "" }));

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setTypewriterMessages((prev) => ({
          ...prev,
          [messageId]: fullText.slice(0, currentIndex),
        }));
        currentIndex++;
      } else {
        clearInterval(interval);
        setTimeout(async () => {
          await Promise.all([
            conversationsQuery.refetch(),
            selectedConversation.refetch(),
          ]);

          setTimeout(() => {
            setIsAiThinking(false);
            setThinkingMessageId(null);
            setTypewriterMessages((prev) => {
              const newState = { ...prev };
              delete newState[messageId];
              return newState;
            });
            setAiResponseContent((prev) => {
              const newState = { ...prev };
              delete newState[messageId];
              return newState;
            });
          }, 100);
        }, 500);
      }
    }, 30);
  };

  const handleSendMessage = () => {
    if (!inputText.trim() || !selectedConversationId) return;

    sendMessageMutation.mutate({
      conversationId: selectedConversationId,
      content: inputText.trim(),
    });
  };

  const handleDeleteConversation = (conversationId: string) => {
    deleteConversationMutation.mutate({ id: conversationId });
  };

  const handleCreateConversation = () => {
    createConversationMutation.mutate({ title: "New Conversation" });
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isTyping = typewriterMessages[item.id] !== undefined;
    const displayText = isTyping ? typewriterMessages[item.id] : item.content;

    return (
      <MessageBubble
        message={item}
        displayText={displayText}
        isTyping={isTyping}
      />
    );
  };

  const renderThinkingMessage = () => {
    if (!thinkingMessageId) return null;

    const hasResponse = aiResponseContent[thinkingMessageId];
    const isTyping = typewriterMessages[thinkingMessageId] !== undefined;

    let displayContent;
    if (isTyping) {
      displayContent = typewriterMessages[thinkingMessageId];
    } else if (hasResponse) {
      displayContent = aiResponseContent[thinkingMessageId];
    } else {
      displayContent = null;
    }

    return (
      <ThinkingMessage
        displayContent={displayContent || undefined}
        isTyping={isTyping}
      />
    );
  };

  const renderConversation = ({ item }: { item: Conversation }) => {
    const isSelected = selectedConversationId === item.id;

    return (
      <ConversationItem
        conversation={item}
        isSelected={isSelected}
        onPress={() => {
          dispatch(setSelectedConversation(item.id));
          closeSidebar();
        }}
        onDelete={() => handleDeleteConversation(item.id)}
      />
    );
  };

  if (conversationsQuery.isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-background-primary">
        <LoadingSpinner message="Loading conversations..." />
      </SafeAreaView>
    );
  }

  const currentConversation = selectedConversation.data;

  return (
    <GestureDetector gesture={panGesture}>
      <SafeAreaView
        className="flex-1 bg-surface-primary"
        edges={["top", "left", "right"]}
      >
        <Animated.View style={[{ flex: 1 }, mainContentAnimatedStyle]}>
          <Pressable
            onPress={closeSidebar}
            disabled={!sidebarOpen}
            className={`flex-1 flex ${sidebarOpen && "opacity-30"}`}
          >
            <View className="flex items-center px-6 py-4 bg-surface-primary border-b border-border-primary flex-row">
              <TouchableOpacity
                onPress={() => {
                  if (sidebarOpen) closeSidebar();
                  else {
                    Keyboard.dismiss();
                    openSidebar();
                  }
                }}
                className="p-2 rounded-lg"
              >
                <Menu size={24} color="#7C67BB" />
              </TouchableOpacity>

              <View className="flex-1 items-center">
                {currentConversation ? (
                  <View className="items-center">
                    <Text className="text-title-lg font-semibold text-text-primary">
                      {currentConversation.title}
                    </Text>
                  </View>
                ) : (
                  <Text className="text-title-lg font-semibold text-text-primary">
                    Chat
                  </Text>
                )}
              </View>

              <View className="w-10" />
            </View>

            <View className="flex-1 bg-background-primary">
              <FlatList
                ref={flatListRef}
                data={[
                  ...((selectedConversation.data?.messages || []) as Message[]),
                  ...(isAiThinking && thinkingMessageId
                    ? [
                        {
                          id: thinkingMessageId,
                          content: "Thinking...",
                          role: "assistant" as const,
                          timestamp: new Date(),
                        },
                      ]
                    : []),
                ]}
                renderItem={({ item }) => {
                  if (item.id === thinkingMessageId && isAiThinking) {
                    return renderThinkingMessage();
                  }
                  return renderMessage({ item });
                }}
                keyExtractor={(item) => item.id}
                className="flex-1 bg-background-primary"
                contentContainerStyle={{
                  paddingTop: 20,
                  paddingHorizontal: 4,
                  flexGrow: 1,
                }}
                ListFooterComponent={() => <View style={{ height: 20 }} />}
                showsVerticalScrollIndicator={false}
                maintainVisibleContentPosition={{
                  minIndexForVisible: 0,
                  autoscrollToTopThreshold: 10,
                }}
                onContentSizeChange={() => {
                  setTimeout(() => {
                    flatListRef.current?.scrollToEnd({ animated: true });
                  }, 100);
                }}
                onLayout={() => {
                  setTimeout(() => {
                    flatListRef.current?.scrollToEnd({ animated: true });
                  }, 100);
                }}
              />
            </View>

            <ChatInput
              value={inputText}
              onChangeText={(text) => dispatch(setInputText(text))}
              onSend={handleSendMessage}
              onPress={() => {
                if (sidebarOpen) closeSidebar();
              }}
              onFocus={() => {
                setTimeout(() => {
                  flatListRef.current?.scrollToEnd({ animated: true });
                }, 300);
              }}
              disabled={
                sendMessageMutation.isPending ||
                sendAiResponseMutation.isPending
              }
              loading={
                sendMessageMutation.isPending ||
                sendAiResponseMutation.isPending ||
                isAiThinking
              }
              keyboardHeight={keyboardHeight}
            />
          </Pressable>
        </Animated.View>

        <Animated.View
          style={[
            {
              position: "absolute",
              top: 0,
              left: 0,
              bottom: 0,
              width: SIDEBAR_WIDTH,
              backgroundColor: "#1b1e25",
              elevation: 8,
              zIndex: 100,
            },
            sidebarAnimatedStyle,
          ]}
        >
          <View className="flex-row items-center justify-between px-6 py-6 border-b border-border-primary mt-12 bg-surface-primary">
            <Text className="text-headline-sm font-bold text-text-primary">
              Conversations
            </Text>
            <TouchableOpacity
              onPress={handleCreateConversation}
              className="p-2 bg-primary rounded-lg "
            >
              <Plus size={20} color="white" />
            </TouchableOpacity>
          </View>

          <FlatList
            data={(conversationsQuery.data || []) as Conversation[]}
            renderItem={renderConversation}
            keyExtractor={(item) => item.id}
            className="flex-1 bg-background-secondary"
            contentContainerStyle={{ paddingVertical: 16 }}
            showsVerticalScrollIndicator={false}
          />
        </Animated.View>
      </SafeAreaView>
    </GestureDetector>
  );
}
