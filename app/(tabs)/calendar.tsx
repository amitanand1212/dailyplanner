import { useMemo, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTaskStore } from "@/store/useTaskStore";
import type { Priority, Task } from "@/types/task";
import {
  MONTHS,
  WEEKDAYS,
  dotColorForCount,
  formatWeekdayLong,
  toISO,
} from "@/utils/date";
import { taskOccursOn } from "@/utils/recurrence";

const PRIORITY_STYLE: Record<Priority, { accent: string; bg: string }> = {
  high: { accent: "#EF4444", bg: "#FEE2E2" },
  medium: { accent: "#F59E0B", bg: "#FEF3C7" },
  low: { accent: "#22C55E", bg: "#DCFCE7" },
};

const SHADOW = {
  shadowColor: "#1A1D2E",
  shadowOpacity: 0.05,
  shadowRadius: 12,
  shadowOffset: { width: 0, height: 4 },
  elevation: 2,
} as const;

function IconButton({
  name,
  onPress,
}: {
  name: keyof typeof Feather.glyphMap;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      className="h-11 w-11 items-center justify-center rounded-2xl bg-white"
      style={SHADOW}
    >
      <Feather name={name} size={20} color="#1A1D2E" />
    </TouchableOpacity>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <View className="flex-row items-center">
      <View className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
      <Text className="ml-1.5 text-xs text-muted">{label}</Text>
    </View>
  );
}

function TaskRow({ task }: { task: Task }) {
  const toggleTask = useTaskStore((s) => s.toggleTask);
  const { accent, bg } = PRIORITY_STYLE[task.priority];
  const done = task.completed;
  const repeatLabel =
    task.repeat === "daily" ? "Daily" : task.repeat === "weekly" ? "Weekly" : null;

  return (
    <View
      className="mb-3 flex-row items-center overflow-hidden rounded-2xl bg-white p-3.5"
      style={SHADOW}
    >
      <View
        className="absolute left-0 top-0 h-full w-1.5 rounded-r-full"
        style={{ backgroundColor: accent }}
      />
      <View
        className="ml-1.5 h-12 w-12 items-center justify-center rounded-2xl"
        style={{ backgroundColor: bg }}
      >
        <Text className="text-xl">{task.emoji}</Text>
      </View>
      <View className="ml-3 flex-1">
        <Text
          className={`text-base font-bold ${done ? "text-muted line-through" : "text-ink"}`}
        >
          {task.title}
        </Text>
        {task.notes ? (
          <Text className="text-xs text-muted" numberOfLines={1}>
            {task.notes}
          </Text>
        ) : null}
        {repeatLabel ? (
          <View className="mt-1 flex-row items-center">
            <Feather name="refresh-cw" size={11} color="#8A8F9C" />
            <Text className="ml-1 text-xs text-muted">{repeatLabel}</Text>
          </View>
        ) : null}
      </View>
      <View className="items-end">
        <Text className="mb-2 text-sm font-semibold" style={{ color: accent }}>
          {task.time}
        </Text>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => toggleTask(task.id)}
          hitSlop={8}
          className="h-6 w-6 items-center justify-center rounded-full border-2"
          style={{
            borderColor: done ? accent : "#D7D9E2",
            backgroundColor: done ? accent : "transparent",
          }}
        >
          {done ? <Ionicons name="checkmark" size={14} color="#fff" /> : null}
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function CalendarScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const tasks = useTaskStore((s) => s.tasks);

  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [selectedDay, setSelectedDay] = useState(now.getDate());

  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (number | null)[] = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  // task count per day for the displayed month (respects recurrence)
  const monthCounts = useMemo(() => {
    const map: Record<number, number> = {};
    for (let day = 1; day <= daysInMonth; day++) {
      const iso = toISO(year, month, day);
      const count = tasks.filter((t) => taskOccursOn(t, iso)).length;
      if (count) map[day] = count;
    }
    return map;
  }, [tasks, year, month, daysInMonth]);

  const goMonth = (delta: number) => {
    let m = month + delta;
    let y = year;
    if (m < 0) { m = 11; y -= 1; }
    if (m > 11) { m = 0; y += 1; }
    setMonth(m);
    setYear(y);
    setSelectedDay(1);
  };

  const selectedISO = toISO(year, month, selectedDay);
  const dayTasks = tasks
    .filter((t) => taskOccursOn(t, selectedISO))
    .sort((a, b) => a.time.localeCompare(b.time));

  return (
    <View className="flex-1 bg-bg">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: insets.top + 12,
          paddingHorizontal: 20,
          paddingBottom: insets.bottom + 110,
        }}
      >
        {/* header */}
        <View className="flex-row items-center justify-between">
          <Text className="text-2xl font-extrabold text-ink">Calendar</Text>
          <View className="flex-row gap-2.5">
            <IconButton
              name="calendar"
              onPress={() => {
                setYear(now.getFullYear());
                setMonth(now.getMonth());
                setSelectedDay(now.getDate());
              }}
            />
          </View>
        </View>

        {/* month nav */}
        <View className="mt-6 flex-row items-center justify-between">
          <IconButton name="chevron-left" onPress={() => goMonth(-1)} />
          <Text className="text-lg font-bold text-ink">
            {MONTHS[month]} {year}
          </Text>
          <IconButton name="chevron-right" onPress={() => goMonth(1)} />
        </View>

        {/* calendar card */}
        <View className="mt-4 rounded-3xl bg-white p-4" style={SHADOW}>
          <View className="flex-row">
            {WEEKDAYS.map((d, i) => (
              <View key={d} className="flex-1 items-center">
                <Text
                  className="text-xs font-bold"
                  style={{ color: i === 0 ? "#EF4444" : i === 6 ? "#6C5CE7" : "#8A8F9C" }}
                >
                  {d}
                </Text>
              </View>
            ))}
          </View>

          <View className="mt-2 flex-row flex-wrap">
            {cells.map((day, idx) => {
              const weekday = idx % 7;
              const selected = day !== null && day === selectedDay;
              const dotColor = day !== null ? dotColorForCount(monthCounts[day] ?? 0) : null;
              const textColor = selected
                ? "#fff"
                : weekday === 0
                ? "#EF4444"
                : weekday === 6
                ? "#6C5CE7"
                : "#1A1D2E";

              return (
                <View key={idx} className="items-center" style={{ width: `${100 / 7}%` }}>
                  <TouchableOpacity
                    activeOpacity={day ? 0.7 : 1}
                    disabled={!day}
                    onPress={() => day && setSelectedDay(day)}
                    className="my-1 h-10 w-10 items-center justify-center rounded-full"
                    style={selected ? { backgroundColor: "#6C5CE7" } : undefined}
                  >
                    <Text
                      className="text-sm"
                      style={{ color: textColor, fontWeight: selected ? "700" : "500" }}
                    >
                      {day ?? ""}
                    </Text>
                  </TouchableOpacity>
                  <View className="h-2">
                    {dotColor ? (
                      <View
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ backgroundColor: dotColor }}
                      />
                    ) : null}
                  </View>
                </View>
              );
            })}
          </View>

          <View className="mt-2 flex-row items-center justify-center gap-5">
            <LegendItem color="#22C55E" label="1-2 Tasks" />
            <LegendItem color="#F59E0B" label="3-4 Tasks" />
            <LegendItem color="#6C5CE7" label="5+ Tasks" />
          </View>
        </View>

        {/* selected day header */}
        <View className="mt-6 flex-row items-center justify-between">
          <View className="flex-1 flex-row items-center pr-2">
            <View className="h-9 w-9 items-center justify-center rounded-xl bg-primary-light">
              <Feather name="calendar" size={16} color="#6C5CE7" />
            </View>
            <Text className="ml-2.5 flex-1 text-base font-bold text-ink" numberOfLines={1}>
              {formatWeekdayLong(selectedISO)}
            </Text>
          </View>
          <View className="flex-row items-center rounded-full bg-primary-light px-3 py-1.5">
            <Text className="text-sm font-semibold text-primary">
              {dayTasks.length} Tasks
            </Text>
          </View>
        </View>

        {/* task list */}
        <View className="mt-4">
          {dayTasks.length ? (
            dayTasks.map((t) => <TaskRow key={t.id} task={t} />)
          ) : (
            <View className="items-center rounded-2xl bg-white py-10" style={SHADOW}>
              <Ionicons name="cafe-outline" size={36} color="#C7C9D4" />
              <Text className="mt-2 text-sm text-muted">No tasks for this day</Text>
            </View>
          )}

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.push("/add-task")}
            className="mt-1 flex-row items-center justify-center rounded-2xl border-2 border-dashed border-primary/40 py-4"
          >
            <Ionicons name="add" size={20} color="#6C5CE7" />
            <Text className="ml-1.5 text-base font-semibold text-primary">Add Task</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
