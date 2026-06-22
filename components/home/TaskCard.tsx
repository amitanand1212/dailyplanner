import { Text, TouchableOpacity, View } from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import type { Task } from "@/types/task";
import { useTaskStore } from "@/store/useTaskStore";
import { formatShortDate } from "@/utils/date";
import PriorityBadge from "@/components/ui/PriorityBadge";

export default function TaskCard({ task }: { task: Task }) {
  const toggleTask = useTaskStore((s) => s.toggleTask);
  const done = task.completed;

  return (
    <View
      className={`mb-3 flex-row items-center rounded-2xl p-4 ${
        done ? "bg-success/10" : "bg-white"
      }`}
      style={
        done
          ? undefined
          : {
              shadowColor: "#1A1D2E",
              shadowOpacity: 0.05,
              shadowRadius: 10,
              shadowOffset: { width: 0, height: 4 },
              elevation: 2,
            }
      }
    >
      {/* checkbox */}
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => toggleTask(task.id)}
        hitSlop={8}
        className={`h-7 w-7 items-center justify-center rounded-full ${
          done ? "bg-success" : "border-2 border-primary"
        }`}
      >
        {done ? <Ionicons name="checkmark" size={16} color="#fff" /> : null}
      </TouchableOpacity>

      {/* body */}
      <View className="ml-3 flex-1">
        <Text
          className={`text-base font-bold ${
            done ? "text-muted line-through" : "text-ink"
          }`}
        >
          {task.title} {task.emoji}
        </Text>
        <View className="mt-1.5 flex-row items-center">
          <Feather name="calendar" size={13} color="#8A8F9C" />
          <Text className="ml-1 mr-3 text-xs text-muted">
            {formatShortDate(task.dateISO)}
          </Text>
          <Feather name="clock" size={13} color="#8A8F9C" />
          <Text className="ml-1 text-xs text-muted">{task.time}</Text>
        </View>
      </View>

      <PriorityBadge priority={task.priority} />
    </View>
  );
}
