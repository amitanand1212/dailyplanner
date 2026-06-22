import { Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export type TaskTab = "pending" | "completed";

interface Props {
  active: TaskTab;
  onChange: (tab: TaskTab) => void;
  pendingCount: number;
  completedCount: number;
}

function Tab({
  label,
  count,
  icon,
  isActive,
  onPress,
}: {
  label: string;
  count: number;
  icon: keyof typeof Ionicons.glyphMap;
  isActive: boolean;
  onPress: () => void;
}) {
  const color = isActive ? "#6C5CE7" : "#8A8F9C";
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      className="flex-1 flex-row items-center justify-center gap-2 pb-3"
      style={{
        borderBottomWidth: 2,
        borderBottomColor: isActive ? "#6C5CE7" : "transparent",
      }}
    >
      <Ionicons name={icon} size={18} color={color} />
      <Text
        className="text-sm font-semibold"
        style={{ color }}
      >
        {label} ({count})
      </Text>
    </TouchableOpacity>
  );
}

export default function TaskTabs({
  active,
  onChange,
  pendingCount,
  completedCount,
}: Props) {
  return (
    <View
      className="mb-5 flex-row"
      style={{ borderBottomWidth: 1, borderBottomColor: "#E7E7EF" }}
    >
      <Tab
        label="Pending"
        count={pendingCount}
        icon="calendar-outline"
        isActive={active === "pending"}
        onPress={() => onChange("pending")}
      />
      <Tab
        label="Completed"
        count={completedCount}
        icon="checkbox-outline"
        isActive={active === "completed"}
        onPress={() => onChange("completed")}
      />
    </View>
  );
}
