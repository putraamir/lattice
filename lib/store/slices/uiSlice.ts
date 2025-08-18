import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UiState {
  sidebarOpen: boolean;
  inputText: string;
  isOnline: boolean;
  theme: "light" | "dark";
  selectedDashboardId: string | null;
  selectedConversationId: string | null;
  notifications: {
    id: string;
    message: string;
    type: "success" | "error" | "info" | "warning";
    timestamp: Date;
  }[];
}

const initialState: UiState = {
  sidebarOpen: false,
  inputText: "",
  isOnline: true,
  theme: "dark",
  selectedDashboardId: null,
  selectedConversationId: null,
  notifications: [],
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setInputText: (state, action: PayloadAction<string>) => {
      state.inputText = action.payload;
    },
    clearInputText: (state) => {
      state.inputText = "";
    },
    setOnlineStatus: (state, action: PayloadAction<boolean>) => {
      state.isOnline = action.payload;
    },
    setTheme: (state, action: PayloadAction<"light" | "dark">) => {
      state.theme = action.payload;
    },
    setSelectedDashboard: (state, action: PayloadAction<string>) => {
      state.selectedDashboardId = action.payload;
    },
    setSelectedConversation: (state, action: PayloadAction<string>) => {
      state.selectedConversationId = action.payload;
    },
    addNotification: (
      state,
      action: PayloadAction<{
        message: string;
        type: "success" | "error" | "info" | "warning";
      }>
    ) => {
      const notification = {
        id: Date.now().toString(),
        ...action.payload,
        timestamp: new Date(),
      };
      state.notifications.unshift(notification);

      if (state.notifications.length > 10) {
        state.notifications = state.notifications.slice(0, 10);
      }
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        (n) => n.id !== action.payload
      );
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
  },
});

export const {
  setSidebarOpen,
  toggleSidebar,
  setInputText,
  clearInputText,
  setOnlineStatus,
  setTheme,
  setSelectedDashboard,
  setSelectedConversation,
  addNotification,
  removeNotification,
  clearNotifications,
} = uiSlice.actions;

export default uiSlice.reducer;
