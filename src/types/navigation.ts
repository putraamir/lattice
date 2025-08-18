import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import type { CompositeNavigationProp } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";

export type RootTabParamList = {
  Chat: undefined;
  Dashboard: undefined;
};

export type TabNavigationProp = BottomTabNavigationProp<RootTabParamList>;

export type ChatScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<RootTabParamList, "Chat">,
  StackNavigationProp<RootTabParamList>
>;

export type DashboardScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<RootTabParamList, "Dashboard">,
  StackNavigationProp<RootTabParamList>
>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootTabParamList {}
  }
}
