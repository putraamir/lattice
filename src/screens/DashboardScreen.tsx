import { Check, Edit3, Plus, Trash2, X } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import { Animated, FlatList, Text, TouchableOpacity, View } from "react-native";
import DraggableFlatList, {
  RenderItemParams,
} from "react-native-draggable-flatlist";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { setSelectedDashboard } from "@/lib/store/slices/uiSlice";
import { useTRPC } from "@/lib/utils/trpc";
import {
  Button,
  DashboardTab,
  EmptyDashboard,
  EmptyWidgets,
  IconButton,
  Input,
  LoadingSpinner,
  Modal,
  WidgetChart,
} from "@/src/components";
import { useMutation, useQuery } from "@tanstack/react-query";

export default function DashboardScreen() {
  const dispatch = useAppDispatch();
  const trpc = useTRPC();

  const { selectedDashboardId } = useAppSelector(
    (state) =>
      state.ui as {
        selectedDashboardId: string | null;
      }
  );

  const [showCreateDashboard, setShowCreateDashboard] = useState(false);
  const [showCreateWidget, setShowCreateWidget] = useState(false);
  const [showDeleteDashboard, setShowDeleteDashboard] = useState(false);
  const [showDeleteWidget, setShowDeleteWidget] = useState(false);
  const [widgetToDelete, setWidgetToDelete] = useState<string | null>(null);
  const [newDashboardName, setNewDashboardName] = useState("");
  const [newWidgetTitle, setNewWidgetTitle] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [reorderedWidgets, setReorderedWidgets] = useState<Widget[]>([]);

  const dashboardsQuery = useQuery(trpc.dashboards.getAll.queryOptions());
  const selectedDashboard = useQuery({
    ...trpc.dashboards.getById.queryOptions({ id: selectedDashboardId || "" }),
    enabled: !!selectedDashboardId,
  });
  const createDashboardMutation = useMutation(
    trpc.dashboards.create.mutationOptions({
      onSuccess: (newDashboard) => {
        dashboardsQuery.refetch();
        dispatch(setSelectedDashboard(newDashboard.id));
        setShowCreateDashboard(false);
        setNewDashboardName("");
      },
    })
  );

  const deleteDashboardMutation = useMutation(
    trpc.dashboards.delete.mutationOptions({
      onSuccess: () => {
        dashboardsQuery.refetch();
        const remainingDashboards = dashboardsQuery.data?.filter(
          (d) => d.id !== selectedDashboardId
        );
        if (remainingDashboards && remainingDashboards.length > 0) {
          dispatch(setSelectedDashboard(remainingDashboards[0].id));
        } else {
          dispatch(setSelectedDashboard(""));
        }
      },
    })
  );

  const addWidgetMutation = useMutation(
    trpc.dashboards.addWidget.mutationOptions({
      onSuccess: () => {
        selectedDashboard.refetch();
        setShowCreateWidget(false);
        setNewWidgetTitle("");
      },
    })
  );

  const deleteWidgetMutation = useMutation(
    trpc.dashboards.deleteWidget.mutationOptions({
      onSuccess: () => {
        selectedDashboard.refetch();
      },
    })
  );

  const reorderWidgetsMutation = useMutation(
    trpc.dashboards.reorderWidgets.mutationOptions({
      onSuccess: () => {
        selectedDashboard.refetch();
        setIsEditMode(false);
      },
    })
  );

  useEffect(() => {
    if (
      !selectedDashboardId &&
      dashboardsQuery.data &&
      dashboardsQuery.data.length > 0
    ) {
      dispatch(setSelectedDashboard(dashboardsQuery.data[0].id));
    }
  }, [dashboardsQuery.data, selectedDashboardId, dispatch]);

  const handleCreateDashboard = () => {
    if (!newDashboardName.trim()) return;
    createDashboardMutation.mutate({ name: newDashboardName.trim() });
  };

  const handleDeleteDashboard = () => {
    if (!selectedDashboardId) return;
    setShowDeleteDashboard(true);
  };

  const confirmDeleteDashboard = () => {
    if (!selectedDashboardId) return;
    deleteDashboardMutation.mutate({ id: selectedDashboardId });
    setShowDeleteDashboard(false);
  };

  const handleCreateWidget = () => {
    if (!newWidgetTitle.trim() || !selectedDashboardId) return;

    addWidgetMutation.mutate({
      dashboardId: selectedDashboardId,
      title: newWidgetTitle.trim(),
      type: "line",
    });
  };

  const handleDeleteWidget = (widgetId: string) => {
    if (!selectedDashboardId) return;
    setWidgetToDelete(widgetId);
    setShowDeleteWidget(true);
  };

  const confirmDeleteWidget = () => {
    if (!selectedDashboardId || !widgetToDelete) return;
    deleteWidgetMutation.mutate({
      dashboardId: selectedDashboardId,
      widgetId: widgetToDelete,
    });
    setShowDeleteWidget(false);
    setWidgetToDelete(null);
  };

  const handleEnterEditMode = () => {
    if (currentDashboard?.widgets) {
      setReorderedWidgets([...currentDashboard.widgets] as Widget[]);
      setIsEditMode(true);
    }
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    setReorderedWidgets([]);
  };

  const handleConfirmEdit = () => {
    if (!selectedDashboardId || reorderedWidgets.length === 0) return;

    const widgetIds = reorderedWidgets.map((widget) => widget.id);
    reorderWidgetsMutation.mutate({
      dashboardId: selectedDashboardId,
      widgetIds,
    });
  };

  const ShakingWidget = ({
    item,
    drag,
    isActive,
    isEditMode,
  }: RenderItemParams<Widget> & { isEditMode: boolean }) => {
    const shakeAnimation = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      if (isEditMode && !isActive) {
        const shake = () => {
          Animated.sequence([
            Animated.timing(shakeAnimation, {
              toValue: 1,
              duration: 50,
              useNativeDriver: true,
            }),
            Animated.timing(shakeAnimation, {
              toValue: -1,
              duration: 100,
              useNativeDriver: true,
            }),
            Animated.timing(shakeAnimation, {
              toValue: 1,
              duration: 100,
              useNativeDriver: true,
            }),
            Animated.timing(shakeAnimation, {
              toValue: 0,
              duration: 50,
              useNativeDriver: true,
            }),
          ]).start(() => {
            setTimeout(() => {
              if (isEditMode && !isActive) {
                shake();
              }
            }, 500 + Math.random() * 1000);
          });
        };

        const timeout = setTimeout(shake, Math.random() * 500);
        return () => clearTimeout(timeout);
      } else {
        shakeAnimation.setValue(0);
      }
    }, [isEditMode, isActive, shakeAnimation]);

    const getTransformStyle = () => {
      const transforms = [];

      if (isEditMode && !isActive) {
        transforms.push({
          translateX: shakeAnimation.interpolate({
            inputRange: [-1, 0, 1],
            outputRange: [-2, 0, 2],
          }),
        });
        transforms.push({
          rotate: shakeAnimation.interpolate({
            inputRange: [-1, 0, 1],
            outputRange: ["-1deg", "0deg", "1deg"],
          }),
        });
      }

      if (isActive) {
        transforms.push({ scale: 0.95 });
      }

      return transforms;
    };

    return (
      <Animated.View style={{ transform: getTransformStyle() }}>
        <TouchableOpacity
          onLongPress={drag}
          disabled={isActive}
          delayLongPress={150}
          activeOpacity={0.8}
          style={isActive ? { opacity: 0.7 } : undefined}
        >
          <WidgetChart
            widget={item}
            onDelete={() => handleDeleteWidget(item.id)}
            isEditMode={isEditMode}
          />
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderDraggableWidget = (props: RenderItemParams<Widget>) => {
    return <ShakingWidget {...props} isEditMode={isEditMode} />;
  };

  const renderWidget = ({ item }: { item: Widget }) => {
    return (
      <WidgetChart widget={item} onDelete={() => handleDeleteWidget(item.id)} />
    );
  };

  const renderDashboardTab = ({ item }: { item: Dashboard }) => (
    <DashboardTab
      dashboard={item}
      isSelected={selectedDashboardId === item.id}
      onPress={() => dispatch(setSelectedDashboard(item.id))}
    />
  );

  if (dashboardsQuery.isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-background-primary">
        <LoadingSpinner message="Loading dashboards..." />
      </SafeAreaView>
    );
  }

  const dashboards = (dashboardsQuery.data || []) as Dashboard[];
  const currentDashboard = selectedDashboard.data as Dashboard | undefined;

  return (
    <SafeAreaView
      className="flex-1 bg-surface-primary"
      edges={["top", "left", "right"]}
    >
      <View className="flex-row items-center justify-between px-6 py-5 bg-surface-primary border-b border-border-primary">
        <Text className="text-headline-md font-bold text-text-primary">
          Dashboards
        </Text>
        <View className="flex-row gap-3">
          <IconButton
            icon={<Plus size={18} color="#7C67BB" />}
            onPress={() => setShowCreateDashboard(true)}
          />
          {selectedDashboardId && (
            <IconButton
              icon={<Trash2 size={18} color="#ef4444" />}
              onPress={handleDeleteDashboard}
            />
          )}
        </View>
      </View>

      {dashboards.length > 0 && (
        <View className="py-4 bg-surface-primary border-b border-border-primary">
          <FlatList
            data={dashboards}
            renderItem={renderDashboardTab}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 24 }}
          />
        </View>
      )}

      {!selectedDashboardId || dashboards.length === 0 ? (
        <EmptyDashboard
          onCreateDashboard={() => setShowCreateDashboard(true)}
        />
      ) : selectedDashboard.isLoading ? (
        <LoadingSpinner message="Loading dashboard..." />
      ) : !currentDashboard ? (
        <EmptyDashboard
          onCreateDashboard={() => setShowCreateDashboard(true)}
        />
      ) : (
        <View className="flex-1 bg-background-primary">
          {currentDashboard.widgets.length === 0 ? (
            <EmptyWidgets onCreateWidget={() => setShowCreateWidget(true)} />
          ) : (
            <>
              {isEditMode ? (
                <DraggableFlatList
                  data={reorderedWidgets}
                  renderItem={renderDraggableWidget}
                  keyExtractor={(item) => item.id}
                  onDragEnd={({ data }) => {
                    try {
                      setReorderedWidgets(data);
                    } catch (error) {
                      console.warn("Error during drag end:", error);
                    }
                  }}
                  scrollEnabled={true}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{ padding: 16 }}
                  autoscrollThreshold={80}
                  autoscrollSpeed={300}
                  ListHeaderComponent={
                    <View className="px-6 py-6 bg-surface-primary rounded-xl mb-4">
                      <View className="flex-row gap-3">
                        <Button
                          title="Cancel"
                          onPress={handleCancelEdit}
                          variant="secondary"
                          icon={<X size={16} color="#71717a" />}
                        />
                        <Button
                          title="Save"
                          onPress={handleConfirmEdit}
                          disabled={reorderWidgetsMutation.isPending}
                          loading={reorderWidgetsMutation.isPending}
                          icon={<Check size={16} color="white" />}
                        />
                      </View>
                    </View>
                  }
                />
              ) : (
                <FlatList
                  data={currentDashboard.widgets as Widget[]}
                  renderItem={renderWidget}
                  keyExtractor={(item) => item.id}
                  scrollEnabled={true}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{ padding: 16 }}
                  ListHeaderComponent={
                    <View className="px-6 py-6 bg-surface-primary rounded-xl mb-4">
                      <View className="flex-row gap-3 flex-wrap">
                        {currentDashboard.widgets.length > 1 && (
                          <Button
                            title="Edit"
                            onPress={handleEnterEditMode}
                            variant="secondary"
                            icon={<Edit3 size={16} color="#7C67BB" />}
                          />
                        )}
                        <Button
                          title="Add Widget"
                          onPress={() => setShowCreateWidget(true)}
                          icon={<Plus size={16} color="white" />}
                        />
                      </View>
                    </View>
                  }
                />
              )}
            </>
          )}
        </View>
      )}

      <Modal
        visible={showCreateDashboard}
        onClose={() => setShowCreateDashboard(false)}
        title="Create Dashboard"
      >
        <Input
          value={newDashboardName}
          onChangeText={setNewDashboardName}
          placeholder="Dashboard name"
          autoFocus
          className="mb-8"
        />
        <View className="flex-row gap-4">
          <Button
            title="Cancel"
            onPress={() => setShowCreateDashboard(false)}
            variant="secondary"
            size="full"
          />
          <Button
            title="Create"
            onPress={handleCreateDashboard}
            disabled={!newDashboardName.trim()}
            loading={createDashboardMutation.isPending}
            size="full"
          />
        </View>
      </Modal>

      <Modal
        visible={showCreateWidget}
        onClose={() => setShowCreateWidget(false)}
        title="Create Widget"
      >
        <Input
          value={newWidgetTitle}
          onChangeText={setNewWidgetTitle}
          placeholder="Widget title"
          autoFocus
          className="mb-8"
        />
        <View className="flex-row gap-4">
          <Button
            title="Cancel"
            onPress={() => setShowCreateWidget(false)}
            variant="secondary"
            size="full"
          />
          <Button
            title="Create"
            onPress={handleCreateWidget}
            disabled={!newWidgetTitle.trim()}
            loading={addWidgetMutation.isPending}
            size="full"
          />
        </View>
      </Modal>

      <Modal
        visible={showDeleteDashboard}
        onClose={() => setShowDeleteDashboard(false)}
        title="Delete Dashboard"
      >
        <View className="items-center mb-6">
          <View className="w-16 h-16 bg-red-500/10 rounded-2xl justify-center items-center mb-4">
            <Trash2 size={32} color="#ef4444" />
          </View>
          <Text className="text-body-md text-text-secondary text-center leading-6">
            Are you sure you want to delete this dashboard? This action cannot
            be undone and all widgets will be lost.
          </Text>
        </View>
        <View className="flex-row gap-4">
          <Button
            title="Cancel"
            onPress={() => setShowDeleteDashboard(false)}
            variant="secondary"
            size="full"
          />
          <Button
            title="Delete"
            onPress={confirmDeleteDashboard}
            loading={deleteDashboardMutation.isPending}
            variant="danger"
            size="full"
          />
        </View>
      </Modal>

      <Modal
        visible={showDeleteWidget}
        onClose={() => setShowDeleteWidget(false)}
        title="Delete Widget"
      >
        <View className="items-center mb-6">
          <View className="w-16 h-16 bg-red-500/10 rounded-2xl justify-center items-center mb-4">
            <Trash2 size={32} color="#ef4444" />
          </View>
          <Text className="text-body-md text-text-secondary text-center leading-6">
            Are you sure you want to delete this widget? This action cannot be
            undone.
          </Text>
        </View>
        <View className="flex-row gap-4">
          <Button
            title="Cancel"
            onPress={() => setShowDeleteWidget(false)}
            variant="secondary"
            size="full"
          />
          <Button
            title="Delete"
            onPress={confirmDeleteWidget}
            loading={deleteWidgetMutation.isPending}
            variant="danger"
            size="full"
          />
        </View>
      </Modal>
    </SafeAreaView>
  );
}
