import { Text, View } from "react-native";
import type { Priority } from "@/types/task";

const config: Record<
  Priority,
  { label: string; bg: string; text: string }
> = {
  high: { label: "High", bg: "bg-priority-highBg", text: "text-priority-high" },
  medium: { label: "Medium", bg: "bg-priority-medBg", text: "text-priority-med" },
  low: { label: "Low", bg: "bg-priority-lowBg", text: "text-priority-low" },
};

export default function PriorityBadge({ priority }: { priority: Priority }) {
  const { label, bg, text } = config[priority];
  return (
    <View className={`rounded-full px-3 py-1.5 ${bg}`}>
      <Text className={`text-xs font-semibold ${text}`}>{label}</Text>
    </View>
  );
}
