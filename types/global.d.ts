/// <reference types="nativewind/types" />

declare module "*.svg" {
  import React from "react";
  import { SvgProps } from "react-native-svg";
  const content: React.FC<SvgProps>;
  export default content;
}

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date | string;
  chartData?: ChartData;
}

interface Conversation {
  id: string;
  title: string;
  createdAt: Date | string;
  messages: Message[];
}

interface ChartDataset {
  data: number[];
  color: (opacity?: number) => string;
}

interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

interface Widget {
  id: string;
  title: string;
  type: "line";
  data: ChartData;
}

interface Dashboard {
  id: string;
  name: string;
  createdAt: Date | string;
  widgets: Widget[];
}
