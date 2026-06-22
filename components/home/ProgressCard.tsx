import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTaskStore } from "@/store/useTaskStore";
import { todayISO } from "@/utils/date";
import { taskOccursOn } from "@/utils/recurrence";
import ProgressRing from "./ProgressRing";

function MiniStat({
  count,
  label,
  variant,
}: {
  count: number;
  label: string;
  variant: "completed" | "pending";
}) {
  const isCompleted = variant === "completed";
  return (
    <View className="flex-1 flex-row items-center rounded-2xl bg-white px-3 py-2.5">
      {isCompleted ? (
        <View className="h-7 w-7 items-center justify-center rounded-full bg-success">
          <Ionicons name="checkmark" size={16} color="#fff" />
        </View>
      ) : (
        <View className="h-7 w-7 items-center justify-center rounded-full border-[3px] border-pending" />
      )}
      <View className="ml-2">
        <Text className="text-base font-bold text-ink">{count}</Text>
        <Text className="text-xs text-muted">{label}</Text>
      </View>
    </View>
  );
}

export default function ProgressCard() {
  const today = todayISO();
  const allTasks = useTaskStore((s) => s.tasks);
  const tasks = allTasks.filter((t) => taskOccursOn(t, today));
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const pending = total - completed;
  const progress = total ? completed / total : 0;

  return (
    <View className="mt-6 flex-row items-center rounded-3xl bg-primary-light p-4">
      <ProgressRing progress={progress} />

      <View className="ml-4 flex-1">
        <Text className="text-base font-bold text-primary">Today&apos;s Progress</Text>
        <Text className="mb-3 mt-0.5 text-sm text-ink">
          {completed} of {total} tasks completed
        </Text>
        <View className="flex-row gap-2.5">
          <MiniStat count={completed} label="Completed" variant="completed" />
          <MiniStat count={pending} label="Pending" variant="pending" />
        </View>
      </View>
    </View>
  );
}
