# Architecture Notes

This document explains the technical architecture decisions, component structure, state management approach, and data flow patterns used in the Lattice application.

## Table of Contents
- [Overall Architecture](#overall-architecture)
- [State Management Strategy](#state-management-strategy)
- [Component Architecture](#component-architecture)
- [Dashboard-Widget Relationship](#dashboard-widget-relationship)
- [Data Flow & API Layer](#data-flow--api-layer)
- [Type Safety & TypeScript](#type-safety--typescript)
- [Performance Optimizations](#performance-optimizations)
- [Development Patterns](#development-patterns)

## Overall Architecture

### Technology Stack
**Core Technologies**:
- **React Native + Expo**: Cross-platform mobile development with native performance
- **TypeScript**: Type safety and developer experience
- **Redux Toolkit**: Predictable state management
- **tRPC**: End-to-end type-safe API communication
- **TanStack Query**: Server state management and caching
- **NativeWind**: Tailwind CSS for React Native styling
- **React Native Reanimated**: High-performance animations

**Rationale**:
- **Type Safety**: TypeScript + tRPC provides full-stack type safety
- **Developer Experience**: Hot reloading, type checking, and modern tooling
- **Performance**: Native animations and optimized rendering
- **Maintainability**: Clear separation of concerns and predictable patterns

### Project Structure
```
lattice/
├── App.tsx                 # Root component with providers
├── lib/                    # Shared utilities and configuration
│   ├── store/             # Redux store configuration
│   └── utils/             # Utility functions and tRPC setup
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── ui/           # Base UI components (Button, Input, etc.)
│   │   ├── chat/         # Chat-specific components
│   │   └── dashboard/    # Dashboard-specific components
│   ├── screens/          # Top-level screen components
│   └── types/            # TypeScript type definitions
├── server/               # Backend API server
└── types/                # Global type definitions
```

**Design Principles**:
- **Feature-Based Organization**: Components grouped by domain (chat, dashboard)
- **Layered Architecture**: Clear separation between UI, business logic, and data
- **Shared Resources**: Common utilities and types in dedicated directories

## State Management Strategy

### Redux Toolkit Implementation
**Decision**: Used Redux Toolkit for client-side state management with a focused, minimal approach.

```typescript
// lib/store/index.ts
export const store = configureStore({
  reducer: {
    ui: uiSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
      },
    }),
});
```

**Rationale**:
- **Predictable Updates**: Redux provides clear, traceable state changes
- **DevTools Integration**: Excellent debugging experience
- **Time Travel**: Ability to replay actions for debugging
- **Minimal Boilerplate**: Redux Toolkit reduces verbose code

### UI State Slice Design
**Implementation**: Single UI slice managing application-wide UI state.

```typescript
interface UiState {
  sidebarOpen: boolean;
  inputText: string;
  isOnline: boolean;
  theme: "light" | "dark";
  selectedDashboardId: string | null;
  selectedConversationId: string | null;
  notifications: NotificationItem[];
}
```

**Key Features**:
- **Centralized UI State**: All UI-related state in one place
- **Optimistic Updates**: Input text stored locally for smooth UX
- **Selection Management**: Tracks active dashboard/conversation
- **Notification System**: Built-in notification queue with auto-cleanup

**Rationale**:
- **Simplicity**: Single slice reduces complexity
- **Performance**: Minimal re-renders through focused selectors
- **Consistency**: Centralized state prevents UI inconsistencies

### Server State Management
**Decision**: TanStack Query for all server-side state management.

```typescript
// Example usage in components
const dashboardsQuery = useQuery(trpc.dashboards.getAll.queryOptions());
const createDashboardMutation = useMutation(
  trpc.dashboards.create.mutationOptions({
    onSuccess: () => {
      dashboardsQuery.refetch(); // Automatic cache invalidation
    },
  })
);
```

**Benefits**:
- **Automatic Caching**: Reduces unnecessary network requests
- **Background Updates**: Keeps data fresh without user intervention
- **Optimistic Updates**: Immediate UI feedback with rollback on errors
- **Loading States**: Built-in loading and error state management

### State Separation Strategy
**Client State vs. Server State**:
- **Client State (Redux)**: UI state, user preferences, temporary form data
- **Server State (TanStack Query)**: API data, conversations, dashboards, widgets

**Rationale**:
- **Clear Boundaries**: Each tool handles what it's best at
- **Performance**: Prevents unnecessary API calls and re-renders
- **Offline Capability**: Client state works without network connectivity

## Component Architecture

### Hierarchical Component Structure
**Organization**: Three-tier component hierarchy for maximum reusability.

```
src/components/
├── ui/                    # Tier 1: Base components
│   ├── Button.tsx         # Reusable across entire app
│   ├── Input.tsx
│   ├── Modal.tsx
│   └── LoadingSpinner.tsx
├── chat/                  # Tier 2: Domain-specific components
│   ├── ChatInput.tsx      # Combines ui components
│   ├── MessageBubble.tsx
│   └── ConversationItem.tsx
└── dashboard/             # Tier 2: Domain-specific components
    ├── WidgetChart.tsx
    ├── DashboardTab.tsx
    └── EmptyDashboard.tsx
```

**Design Principles**:
- **Composition Over Inheritance**: Components built by combining simpler components
- **Single Responsibility**: Each component has one clear purpose
- **Prop Interface Design**: Clear, typed interfaces with sensible defaults

### Base UI Component Design
**Example: Button Component**

```typescript
interface ButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "danger";
  loading?: boolean;
  size?: "sm" | "md" | "lg" | "full";
  icon?: React.ReactNode;
}
```

**Key Design Decisions**:
- **Variant System**: Semantic variants instead of arbitrary styling
- **Loading States**: Built-in loading indicators with disabled states
- **Icon Support**: Flexible icon integration
- **Size System**: Consistent sizing across the application

**Rationale**:
- **Consistency**: Ensures uniform button behavior
- **Accessibility**: Proper disabled states and touch targets
- **Flexibility**: Covers all use cases without becoming complex

### Domain-Specific Components
**Example: Dashboard Widget Architecture**

```typescript
// WidgetChart.tsx - Handles chart rendering and interactions
interface WidgetChartProps {
  widget: {
    id: string;
    title: string;
    data: any;
  };
  onDelete: () => void;
  isEditMode?: boolean;
}
```

**Features**:
- **Responsive Sizing**: Charts adapt to screen width
- **Color Management**: Consistent color schemes with fallbacks
- **Edit Mode Integration**: Conditional UI based on edit state
- **Touch Interactions**: Mobile-optimized chart interactions

### Screen-Level Component Architecture
**Pattern**: Screen components orchestrate domain components and handle business logic.

```typescript
// DashboardScreen.tsx structure
export default function DashboardScreen() {
  // 1. Hooks and state
  const dispatch = useAppDispatch();
  const trpc = useTRPC();
  const { selectedDashboardId } = useAppSelector(...);
  
  // 2. Data fetching
  const dashboardsQuery = useQuery(...);
  const selectedDashboard = useQuery(...);
  
  // 3. Mutations
  const createDashboardMutation = useMutation(...);
  
  // 4. Event handlers
  const handleCreateDashboard = () => { ... };
  
  // 5. Render logic
  return (
    <SafeAreaView>
      {/* Component composition */}
    </SafeAreaView>
  );
}
```

**Rationale**:
- **Clear Structure**: Consistent organization makes code predictable
- **Separation of Concerns**: Business logic separate from presentation
- **Testability**: Pure functions and clear dependencies

## Dashboard-Widget Relationship

### Data Model Design
**Type Definitions**:

```typescript
interface Widget {
  id: string;
  title: string;
  type: "line" | "bar" | "pie";
  data: ChartData;
}

interface Dashboard {
  id: string;
  name: string;
  createdAt: Date | string;
  widgets: Widget[];
}
```

**Relationship Design**:
- **Composition**: Dashboards contain widgets as nested objects
- **Ordering**: Widgets maintain order through array position
- **Immutability**: Updates create new objects for predictable state changes

### CRUD Operations Architecture
**Dashboard Management**:

```typescript
// tRPC router structure for dashboards
dashboards: router({
  getAll: publicProcedure.query(() => mockDashboards),
  getById: publicProcedure.input(z.object({ id: z.string() })).query(...),
  create: publicProcedure.input(z.object({ name: z.string() })).mutation(...),
  delete: publicProcedure.input(z.object({ id: z.string() })).mutation(...),
  
  // Widget operations
  addWidget: publicProcedure.input(widgetSchema).mutation(...),
  deleteWidget: publicProcedure.input(deleteWidgetSchema).mutation(...),
  reorderWidgets: publicProcedure.input(reorderSchema).mutation(...),
}),
```

**Key Architectural Decisions**:
- **Nested Operations**: Widget operations require dashboard context
- **Atomic Updates**: Widget changes update entire dashboard for consistency
- **Validation**: Zod schemas ensure data integrity
- **Error Handling**: Graceful failure with rollback capabilities

### Widget Reordering System
**Implementation**: Drag-and-drop reordering with optimistic updates.

```typescript
// Edit mode state management
const [isEditMode, setIsEditMode] = useState(false);
const [reorderedWidgets, setReorderedWidgets] = useState<Widget[]>([]);

// Reorder mutation
const reorderWidgetsMutation = useMutation({
  mutationFn: trpc.dashboards.reorderWidgets.mutate,
  onSuccess: () => {
    setIsEditMode(false);
    dashboardQuery.refetch();
  },
});
```

**Features**:
- **Visual Feedback**: Shaking animation indicates edit mode
- **Temporary State**: Changes held locally until confirmed
- **Rollback Capability**: Cancel button restores original order
- **Optimistic Updates**: Immediate visual feedback

**Rationale**:
- **User Control**: Direct manipulation feels natural on mobile
- **Safety**: Confirmation step prevents accidental reordering
- **Performance**: Local state updates provide smooth interactions

### Widget Chart Integration
**Chart Library Integration**: react-native-chart-kit for consistent chart rendering.

```typescript
// Dynamic color generation for widgets
const getFallbackColor = (opacity = 1) => {
  const colorIndex = parseInt(widget.id) % fallbackColors.length;
  const color = fallbackColors[colorIndex];
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};
```

**Features**:
- **Responsive Sizing**: Charts adapt to available screen space
- **Color Consistency**: Deterministic color assignment based on widget ID
- **Performance Optimization**: Minimal re-renders through proper memoization
- **Accessibility**: High contrast colors for readability

## Data Flow & API Layer

### tRPC Integration Architecture
**Setup**: End-to-end type safety from client to server.

```typescript
// lib/utils/trpc.ts
export const TRPCProvider: React.FC<TRPCProviderProps> = ({
  children,
  trpcClient,
  queryClient,
}) => {
  const [client] = useState(() => trpc.createClient({ client: trpcClient }));
  
  return (
    <trpc.Provider client={client} queryClient={queryClient}>
      {children}
    </trpc.Provider>
  );
};
```

**Benefits**:
- **Type Safety**: Compile-time checking of API calls
- **Auto-completion**: Full IDE support for API methods
- **Runtime Validation**: Zod schemas validate data at runtime
- **Error Handling**: Structured error responses

### Mock Data Strategy
**Development Approach**: In-memory mock data for rapid development.

```typescript
// server/index.ts - Mock data structure
const mockDashboards: Dashboard[] = [
  {
    id: "1",
    name: "Sales Overview",
    createdAt: new Date("2024-01-15"),
    widgets: [/* ... */],
  },
  // Additional mock dashboards
];
```

**Features**:
- **Realistic Data**: Mock data reflects production data structure
- **Stateful Operations**: CRUD operations modify mock data in memory
- **Development Speed**: No database setup required for development
- **Testing**: Predictable data for automated testing

### Real-time Features Architecture
**Chat Simulation**: Typewriter effect and thinking states for realistic chat experience.

```typescript
// Simulated AI response flow
const sendAiResponseMutation = useMutation({
  onSuccess: (data) => {
    if (data.aiMessage && thinkingMessageId) {
      startTypewriterEffectOnThinkingMessage(
        thinkingMessageId,
        data.aiMessage.content
      );
    }
  },
});
```

**Implementation Details**:
- **Thinking States**: Visual indicators during AI processing
- **Typewriter Effect**: Character-by-character text revelation
- **Optimistic Updates**: Immediate user message display
- **Error Recovery**: Graceful handling of failed responses

## Type Safety & TypeScript

### Comprehensive Type Coverage
**Global Types**: Shared type definitions for core entities.

```typescript
// types/global.d.ts
interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
}
```

**Benefits**:
- **Consistency**: Same types used across client and server
- **Refactoring Safety**: Type checking prevents breaking changes
- **Documentation**: Types serve as living documentation
- **IDE Support**: Full auto-completion and error checking

### Navigation Type Safety
**Typed Navigation**: React Navigation with TypeScript integration.

```typescript
// src/types/navigation.ts
export type RootTabParamList = {
  Chat: undefined;
  Dashboard: undefined;
};

export type TabNavigationProp = BottomTabNavigationProp<RootTabParamList>;
```

**Rationale**:
- **Route Safety**: Prevents navigation to non-existent routes
- **Parameter Validation**: Ensures correct parameter types
- **Refactoring Support**: Safe route renaming and modification

### Component Prop Types
**Strict Interfaces**: Every component has well-defined prop interfaces.

```typescript
interface ChatInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  onFocus?: () => void;
  disabled?: boolean;
  loading?: boolean;
  keyboardHeight: Animated.SharedValue<number>;
}
```

**Benefits**:
- **API Documentation**: Props serve as component API documentation
- **Runtime Safety**: Prevents prop type mismatches
- **Developer Experience**: Clear contracts between components

## Performance Optimizations

### Rendering Optimizations
**FlatList Usage**: Virtualized lists for large datasets.

```typescript
// Chat message rendering
<FlatList
  data={messages}
  renderItem={renderMessage}
  keyExtractor={(item) => item.id}
  maintainVisibleContentPosition={{
    minIndexForVisible: 0,
    autoscrollToTopThreshold: 10,
  }}
/>
```

**Features**:
- **Virtualization**: Only renders visible items
- **Scroll Performance**: Optimized scroll behavior
- **Memory Management**: Automatic cleanup of off-screen items

### Animation Performance
**React Native Reanimated**: Native-thread animations for smooth performance.

```typescript
// Sidebar animation with native performance
const sidebarAnimatedStyle = useAnimatedStyle(() => ({
  transform: [{ translateX: sidebarX.value - SIDEBAR_WIDTH }],
}));
```

**Benefits**:
- **60fps Performance**: Animations run on native thread
- **Gesture Integration**: Smooth gesture-driven animations
- **Battery Efficiency**: Optimized for mobile device constraints

### State Update Optimizations
**Selective Re-renders**: Focused selectors prevent unnecessary updates.

```typescript
// Focused selector for specific UI state
const { selectedDashboardId } = useAppSelector((state) => ({
  selectedDashboardId: state.ui.selectedDashboardId,
}));
```

**Rationale**:
- **Performance**: Components only re-render when relevant state changes
- **Predictability**: Clear dependencies for each component
- **Debugging**: Easier to track what causes re-renders

## Development Patterns

### Custom Hooks Pattern
**Redux Integration**: Typed hooks for state management.

```typescript
// lib/store/hooks.ts
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

**Benefits**:
- **Type Safety**: Fully typed Redux usage
- **Consistency**: Same hooks used throughout application
- **Maintainability**: Easy to modify Redux integration

### Error Handling Strategy
**Layered Error Handling**: Multiple levels of error management.

1. **API Level**: tRPC error handling with structured responses
2. **Query Level**: TanStack Query error states and retries
3. **UI Level**: Error boundaries and user-friendly messages
4. **Global Level**: Notification system for critical errors

### Testing Architecture
**Component Testing Strategy**:
- **Unit Tests**: Individual component behavior
- **Integration Tests**: Component interaction patterns
- **E2E Tests**: Full user workflow testing
- **Type Tests**: TypeScript compilation as testing

### Code Organization Principles
**File Naming Conventions**:
- **Components**: PascalCase (e.g., `ChatInput.tsx`)
- **Hooks**: camelCase with "use" prefix (e.g., `useAppSelector`)
- **Types**: PascalCase interfaces (e.g., `ChatInputProps`)
- **Utilities**: camelCase functions (e.g., `formatDate`)

**Import Organization**:
1. External libraries
2. Internal utilities and types
3. Components
4. Relative imports

This architecture documentation provides a comprehensive understanding of the technical decisions and patterns used throughout the Lattice application, serving as a guide for future development and maintenance.
