import { store } from "@/lib/store";
import { TRPCProvider } from "@/lib/utils/trpc";
import type { AppRouter } from "@/server";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import Constants from "expo-constants";
import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";
import { BarChart3, MessageCircle } from "lucide-react-native";
import { default as React, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import { Provider } from "react-redux";
import "./global.css";

import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import ChatScreen from "./src/screens/ChatScreen";
import DashboardScreen from "./src/screens/DashboardScreen";
import type { RootTabParamList } from "./src/types/navigation";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;
function getQueryClient() {
  if (typeof window === "undefined") {
    return makeQueryClient();
  } else {
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

function AppContent() {
  const safeAreaInset = useSafeAreaInsets();
  const queryClient = getQueryClient();
  const url = Constants.expoConfig?.extra?.serverUrl || "localhost";
  const port = Constants.expoConfig?.extra?.serverPort || "3000";
  const [trpcClientInstance] = useState(() =>
    createTRPCClient<AppRouter>({
      links: [
        httpBatchLink({
          url: `http://${url}:${port}/trpc`,
        }),
      ],
    })
  );

  const Tab = createBottomTabNavigator<RootTabParamList>();

  return (
    <NavigationContainer>
      <Provider store={store}>
        <GestureHandlerRootView style={{ flex: 1, backgroundColor: "#1b1e25" }}>
          <QueryClientProvider client={queryClient}>
            <TRPCProvider
              trpcClient={trpcClientInstance}
              queryClient={queryClient}
            >
              <Tab.Navigator
                screenOptions={{
                  headerShown: false,
                  tabBarStyle: {
                    backgroundColor: "#1b1e25",
                    borderTopWidth: 0,
                    marginBottom: safeAreaInset.bottom,
                  },
                  tabBarActiveTintColor: "#7C67BB",
                  tabBarInactiveTintColor: "#71717a",
                  tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: "500",
                    marginTop: 4,
                  },
                }}
              >
                <Tab.Screen
                  name="Chat"
                  component={ChatScreen}
                  options={{
                    tabBarIcon: ({ color, focused }) => (
                      <MessageCircle
                        size={24}
                        color={color}
                        fill={focused ? color : "transparent"}
                      />
                    ),
                  }}
                />
                <Tab.Screen
                  name="Dashboard"
                  component={DashboardScreen}
                  options={{
                    tabBarIcon: ({ color, focused }) => (
                      <BarChart3 size={24} color={color} />
                    ),
                  }}
                />
              </Tab.Navigator>
              <StatusBar style="light" translucent={true} />
            </TRPCProvider>
          </QueryClientProvider>
        </GestureHandlerRootView>
      </Provider>
    </NavigationContainer>
  );
}

export default function App() {
  const [loaded] = useFonts({
    SpaceMono: require("./assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <AppContent />
    </SafeAreaProvider>
  );
}
