import { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTaskStore } from "@/store/useTaskStore";
import { BANNER_HEIGHT } from "@/utils/ads";
import { todayISO } from "@/utils/date";
import { taskOccursOn } from "@/utils/recurrence";
import Header from "@/components/home/Header";
import ProgressCard from "@/components/home/ProgressCard";
import SectionTitle from "@/components/home/SectionTitle";
import TaskTabs, { type TaskTab } from "@/components/home/TaskTabs";
import TaskCard from "@/components/home/TaskCard";

function EmptyState({ label }: { label: string }) {
  return (
    <View className="items-center rounded-2xl bg-white py-8">
      <Ionicons name="checkmark-done-circle-outline" size={36} color="#C7C9D4" />
      <Text className="mt-2 text-sm text-muted">{label}</Text>
    </View>
  );
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const today = todayISO();
  const tasks = useTaskStore((s) => s.tasks);
  const [tab, setTab] = useState<TaskTab>("pending");

  const todays = tasks.filter((t) => taskOccursOn(t, today));
  const pending = todays.filter((t) => !t.completed);
  const completed = todays.filter((t) => t.completed);

  return (
    <View className="flex-1 bg-bg">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: insets.top + 12,
          paddingHorizontal: 20,
          // extra space so the last task clears the tab bar + anchored ad banner
          paddingBottom: insets.bottom + 110 + BANNER_HEIGHT,
        }}
      >
        <Header />
        <ProgressCard />

        <View className="mt-7">
          <SectionTitle>Today&apos;s Tasks</SectionTitle>
          <TaskTabs
            active={tab}
            onChange={setTab}
            pendingCount={pending.length}
            completedCount={completed.length}
          />

          {tab === "pending" ? (
            <>
              {pending.length ? (
                pending.map((task) => <TaskCard key={task.id} task={task} />)
              ) : (
                <EmptyState label="No pending tasks for today 🎉" />
              )}

              <View className="mt-4">
                <SectionTitle>Completed Tasks</SectionTitle>
                {completed.length ? (
                  completed.map((task) => <TaskCard key={task.id} task={task} />)
                ) : (
                  <EmptyState label="Nothing completed yet today" />
                )}
              </View>
            </>
          ) : completed.length ? (
            completed.map((task) => <TaskCard key={task.id} task={task} />)
          ) : (
            <EmptyState label="Nothing completed yet today" />
          )}
        </View>
      </ScrollView>
    </View>
  );
}
