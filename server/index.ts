import { initTRPC } from "@trpc/server";
import { z } from "zod";

const t = initTRPC.create();

export const router = t.router;
export const publicProcedure = t.procedure;

const mockConversations = [
  {
    id: "1",
    title: "Portfolio Analysis",
    createdAt: new Date("2024-01-15"),
    messages: [
      {
        id: "1",
        content:
          "Hello! I'm your AI financial advisor. How can I help you with your investments today?",
        role: "assistant" as const,
        timestamp: new Date("2024-01-15T10:00:00Z"),
      },
      {
        id: "2",
        content:
          "I want to analyze my portfolio performance over the last 6 months",
        role: "user" as const,
        timestamp: new Date("2024-01-15T10:01:00Z"),
      },
      {
        id: "3",
        content:
          "I'd be happy to help you analyze your portfolio performance! To provide the most accurate analysis, I'll need some information about your holdings. However, I can show you a sample portfolio performance chart to demonstrate the type of analysis I can provide.",
        role: "assistant" as const,
        timestamp: new Date("2024-01-15T10:01:30Z"),
        chartData: {
          labels: ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
          datasets: [
            {
              data: [100000, 102500, 98500, 105000, 108500, 112000],
              color: (opacity = 1) => `rgba(34, 197, 94, ${opacity})`, // Green for growth
            },
          ],
        },
      },
    ],
  },
  {
    id: "2",
    title: "Market Trends",
    createdAt: new Date("2024-01-16"),
    messages: [
      {
        id: "4",
        content: "What are the current market trends I should be aware of?",
        role: "user" as const,
        timestamp: new Date("2024-01-16T14:00:00Z"),
      },
      {
        id: "5",
        content:
          "Here are the key market trends to watch:\n\n📈 **Tech Sector**: Strong performance in AI and cloud computing stocks\n📊 **Interest Rates**: Federal Reserve policy impacts on bond yields\n🏠 **Real Estate**: Housing market showing signs of stabilization\n💰 **Commodities**: Gold maintaining strength as inflation hedge\n🌍 **International**: Emerging markets showing resilience\n\nWould you like me to generate a chart showing sector performance comparison?",
        role: "assistant" as const,
        timestamp: new Date("2024-01-16T14:00:45Z"),
      },
    ],
  },
  {
    id: "3",
    title: "Investment Strategy",
    createdAt: new Date("2024-01-17"),
    messages: [
      {
        id: "6",
        content: "Can you help me develop a diversified investment strategy?",
        role: "user" as const,
        timestamp: new Date("2024-01-17T09:30:00Z"),
      },
      {
        id: "7",
        content:
          "Absolutely! Here's a balanced diversification strategy:\n\n🎯 **Asset Allocation**:\n• 60% Stocks (40% domestic, 20% international)\n• 30% Bonds (government and corporate)\n• 10% Alternative investments (REITs, commodities)\n\n📊 **Risk Management**:\n• Dollar-cost averaging for regular investments\n• Rebalancing quarterly\n• Emergency fund covering 6 months expenses\n\n⏰ **Time Horizon**: Adjust allocation based on your investment timeline\n\nWould you like me to show you a sample allocation chart?",
        role: "assistant" as const,
        timestamp: new Date("2024-01-17T09:31:15Z"),
      },
    ],
  },
];

const mockDashboards = [
  {
    id: "1",
    name: "Investment Portfolio",
    createdAt: new Date("2024-01-15"),
    widgets: [
      {
        id: "1",
        title: "Portfolio Value",
        type: "line" as const,
        data: {
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
          datasets: [
            {
              data: [125000, 132000, 128500, 145000, 158000, 162000],
              color: (opacity = 1) => `rgba(34, 197, 94, ${opacity})`, // Green for growth
            },
          ],
        },
      },
      {
        id: "2",
        title: "Monthly Returns (%)",
        type: "line" as const,
        data: {
          labels: ["Q1", "Q2", "Q3", "Q4"],
          datasets: [
            {
              data: [5.6, 8.2, -2.1, 12.4],
              color: (opacity = 1) => `rgba(99, 102, 241, ${opacity})`,
            },
          ],
        },
      },
    ],
  },
  {
    id: "2",
    name: "Market Analysis",
    createdAt: new Date("2024-01-16"),
    widgets: [
      {
        id: "3",
        title: "Sector Performance (%)",
        type: "line" as const,
        data: {
          labels: ["Tech", "Healthcare", "Finance", "Energy", "Consumer"],
          datasets: [
            {
              data: [15.2, 8.7, 12.3, -3.4, 6.8],
              color: (opacity = 1) => `rgba(139, 92, 246, ${opacity})`, // Secondary color
            },
          ],
        },
      },
    ],
  },
];

const aiResponses = [
  "Great question! Let me analyze the financial data for you.",
  "I can help you with that investment decision. Here's my analysis:",
  "That's an important financial consideration. Let me break it down:",
  "Based on current market conditions, here's what I recommend:",
  "Let me show you the numbers with a detailed chart analysis:",
  "Excellent timing for this question! The market data suggests:",
  "I'll generate a visual representation to help illustrate this concept:",
  "Let me provide you with a comprehensive financial breakdown:",
];

const generateFinancialChart = (type: string) => {
  const chartTypes = {
    portfolio: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      datasets: [
        {
          data: [10000, 12500, 11800, 14200, 16500, 18200],
          color: (opacity = 1) => `rgba(34, 197, 94, ${opacity})`,
        },
      ],
    },
    sector: {
      labels: ["Tech", "Healthcare", "Finance", "Energy", "Consumer"],
      datasets: [
        {
          data: [25, 18, 22, 12, 23],
          color: (opacity = 1) => `rgba(99, 102, 241, ${opacity})`,
        },
      ],
    },
    performance: {
      labels: ["Q1", "Q2", "Q3", "Q4"],
      datasets: [
        {
          data: [8.5, 12.3, 6.7, 15.2],
          color: (opacity = 1) => `rgba(139, 92, 246, ${opacity})`,
        },
      ],
    },
    allocation: {
      labels: ["Stocks", "Bonds", "Real Estate", "Commodities", "Cash"],
      datasets: [
        {
          data: [60, 25, 8, 5, 2],
          color: (opacity = 1) => `rgba(6, 182, 212, ${opacity})`,
        },
      ],
    },
  };

  return chartTypes[type as keyof typeof chartTypes] || chartTypes.portfolio;
};

const chartTriggerKeywords = [
  "chart",
  "graph",
  "show",
  "visualize",
  "plot",
  "display",
  "portfolio",
  "performance",
  "allocation",
  "sector",
  "trend",
  "analysis",
  "breakdown",
  "comparison",
  "growth",
];

export const appRouter = router({
  conversations: router({
    getAll: publicProcedure.query(() => {
      return mockConversations;
    }),

    getById: publicProcedure
      .input(z.object({ id: z.string() }))
      .query(({ input }) => {
        return mockConversations.find((conv) => conv.id === input.id);
      }),

    create: publicProcedure
      .input(z.object({ title: z.string() }))
      .mutation(({ input }) => {
        const newConversation = {
          id: (mockConversations.length + 1).toString(),
          title: input.title,
          createdAt: new Date(),
          messages: [],
        };
        mockConversations.push(newConversation);
        return newConversation;
      }),

    delete: publicProcedure
      .input(z.object({ id: z.string() }))
      .mutation(({ input }) => {
        const index = mockConversations.findIndex(
          (conv) => conv.id === input.id
        );
        if (index > -1) {
          mockConversations.splice(index, 1);
        }
        return { success: true };
      }),

    rename: publicProcedure
      .input(z.object({ id: z.string(), title: z.string() }))
      .mutation(({ input }) => {
        const conversation = mockConversations.find(
          (conv) => conv.id === input.id
        );
        if (conversation) {
          conversation.title = input.title;
        }
        return conversation;
      }),

    sendMessage: publicProcedure
      .input(
        z.object({
          conversationId: z.string(),
          content: z.string(),
        })
      )
      .mutation(({ input }) => {
        const conversation = mockConversations.find(
          (conv) => conv.id === input.conversationId
        );
        if (!conversation) {
          throw new Error("Conversation not found");
        }

        const userMessage = {
          id: Date.now().toString(),
          content: input.content,
          role: "user" as const,
          timestamp: new Date(),
        };
        conversation.messages.push(userMessage);

        return {
          userMessage,
        };
      }),

    sendAiResponse: publicProcedure
      .input(
        z.object({
          conversationId: z.string(),
          userMessage: z.string().optional(),
        })
      )
      .mutation(({ input }) => {
        const conversation = mockConversations.find(
          (conv) => conv.id === input.conversationId
        );
        if (!conversation) {
          throw new Error("Conversation not found");
        }

        const lastUserMessage =
          input.userMessage ||
          conversation.messages.filter((m) => m.role === "user").slice(-1)[0]
            ?.content ||
          "";

        const shouldGenerateChart = chartTriggerKeywords.some((keyword) =>
          lastUserMessage.toLowerCase().includes(keyword.toLowerCase())
        );

        let chartType = "portfolio";
        if (lastUserMessage.toLowerCase().includes("sector"))
          chartType = "sector";
        else if (lastUserMessage.toLowerCase().includes("performance"))
          chartType = "performance";
        else if (lastUserMessage.toLowerCase().includes("allocation"))
          chartType = "allocation";

        const aiResponse =
          aiResponses[Math.floor(Math.random() * aiResponses.length)];

        let enhancedResponse = aiResponse;
        if (shouldGenerateChart) {
          enhancedResponse += "\n\nHere's a chart to visualize the data:";
        }

        const aiMessage = {
          id: Date.now().toString(),
          content: enhancedResponse,
          role: "assistant" as const,
          timestamp: new Date(),
          ...(shouldGenerateChart && {
            chartData: generateFinancialChart(chartType),
          }),
        };
        conversation.messages.push(aiMessage);

        return {
          aiMessage,
        };
      }),
  }),

  dashboards: router({
    getAll: publicProcedure.query(() => {
      return mockDashboards;
    }),

    getById: publicProcedure
      .input(z.object({ id: z.string() }))
      .query(({ input }) => {
        return mockDashboards.find((dashboard) => dashboard.id === input.id);
      }),

    create: publicProcedure
      .input(z.object({ name: z.string() }))
      .mutation(({ input }) => {
        const newDashboard = {
          id: (mockDashboards.length + 1).toString(),
          name: input.name,
          createdAt: new Date(),
          widgets: [],
        };
        mockDashboards.push(newDashboard);
        return newDashboard;
      }),

    delete: publicProcedure
      .input(z.object({ id: z.string() }))
      .mutation(({ input }) => {
        const index = mockDashboards.findIndex(
          (dashboard) => dashboard.id === input.id
        );
        if (index > -1) {
          mockDashboards.splice(index, 1);
        }
        return { success: true };
      }),

    addWidget: publicProcedure
      .input(
        z.object({
          dashboardId: z.string(),
          title: z.string(),
          type: z.literal("line"),
        })
      )
      .mutation(({ input }) => {
        const dashboard = mockDashboards.find(
          (d) => d.id === input.dashboardId
        );
        if (!dashboard) {
          throw new Error("Dashboard not found");
        }

        const sampleData = {
          labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
          datasets: [
            {
              data: [
                Math.floor(Math.random() * 100),
                Math.floor(Math.random() * 100),
                Math.floor(Math.random() * 100),
                Math.floor(Math.random() * 100),
              ],
              color: (opacity = 1) => {
                const colors = [
                  `rgba(99, 102, 241, ${opacity})`,
                  `rgba(139, 92, 246, ${opacity})`,
                  `rgba(6, 182, 212, ${opacity})`,
                  `rgba(16, 185, 129, ${opacity})`,
                  `rgba(245, 158, 11, ${opacity})`,
                ];
                return colors[Math.floor(Math.random() * colors.length)];
              },
            },
          ],
        };

        const newWidget = {
          id: Date.now().toString(),
          title: input.title,
          type: input.type,
          data: sampleData,
        };

        dashboard.widgets.push(newWidget);
        return newWidget;
      }),

    deleteWidget: publicProcedure
      .input(
        z.object({
          dashboardId: z.string(),
          widgetId: z.string(),
        })
      )
      .mutation(({ input }) => {
        const dashboard = mockDashboards.find(
          (d) => d.id === input.dashboardId
        );
        if (!dashboard) {
          throw new Error("Dashboard not found");
        }

        const widgetIndex = dashboard.widgets.findIndex(
          (w) => w.id === input.widgetId
        );
        if (widgetIndex > -1) {
          dashboard.widgets.splice(widgetIndex, 1);
        }

        return { success: true };
      }),

    reorderWidgets: publicProcedure
      .input(
        z.object({
          dashboardId: z.string(),
          widgetIds: z.array(z.string()),
        })
      )
      .mutation(({ input }) => {
        const dashboard = mockDashboards.find(
          (d) => d.id === input.dashboardId
        );
        if (!dashboard) {
          throw new Error("Dashboard not found");
        }

        const reorderedWidgets = input.widgetIds
          .map((id) => dashboard.widgets.find((w) => w.id === id))
          .filter((widget) => widget !== undefined);

        dashboard.widgets = reorderedWidgets;
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
