import { useMemo, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTaskStore } from "@/store/useTaskStore";
import { useUserStore } from "@/store/useUserStore";
import type { Priority, Repeat } from "@/types/task";
import { buildTimeOptions, dateToISO, formatLongDate, formatMediumDate } from "@/utils/date";
import PickerModal from "@/components/ui/PickerModal";

function buildDateOptions() {
  const today = new Date();
  return Array.from({ length: 120 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return dateToISO(d);
  });
}

const SHADOW = {
  shadowColor: "#1A1D2E",
  shadowOpacity: 0.05,
  shadowRadius: 12,
  shadowOffset: { width: 0, height: 4 },
  elevation: 2,
} as const;

function HeaderIcon({
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

function CardHeader({
  icon,
  label,
  required,
  optional,
}: {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  required?: boolean;
  optional?: boolean;
}) {
  return (
    <View className="mb-3 flex-row items-center">
      <View className="h-9 w-9 items-center justify-center rounded-xl bg-primary-light">
        <Feather name={icon} size={18} color="#6C5CE7" />
      </View>
      <Text className="ml-3 text-base font-bold text-ink">
        {label}
        {required ? <Text className="text-priority-high"> *</Text> : null}
        {optional ? <Text className="font-normal text-muted"> (Optional)</Text> : null}
      </Text>
    </View>
  );
}

const PRIORITIES: { value: Priority; label: string; color: string; bg: string }[] = [
  { value: "low", label: "Low", color: "#22C55E", bg: "#DCFCE7" },
  { value: "medium", label: "Medium", color: "#F59E0B", bg: "#FEF3C7" },
  { value: "high", label: "High", color: "#EF4444", bg: "#FEE2E2" },
];

const REPEATS: { value: Repeat; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { value: "none", label: "None", icon: "ban-outline" },
  { value: "daily", label: "Daily", icon: "sync-outline" },
  { value: "weekly", label: "Weekly", icon: "calendar-outline" },
];

export default function AddTaskScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const addTask = useTaskStore((s) => s.addTask);
  const wakeTime = useUserStore((s) => s.wakeTime);

  const dateOptions = useMemo(buildDateOptions, []); // ISO strings
  const dateLabels = useMemo(() => dateOptions.map(formatLongDate), [dateOptions]);
  const timeOptions = useMemo(buildTimeOptions, []);

  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [dateISO, setDateISO] = useState(dateOptions[0]);
  const [time, setTime] = useState(wakeTime);
  const [priority, setPriority] = useState<Priority>("medium");
  const [repeat, setRepeat] = useState<Repeat>("none");

  const [showDate, setShowDate] = useState(false);
  const [showTime, setShowTime] = useState(false);

  const canSave = title.trim().length > 0;

  const handleSave = () => {
    if (!canSave) return;
    addTask({ title: title.trim(), emoji: "📝", dateISO, time, priority, repeat, notes });
    router.back();
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-bg"
      style={{ paddingTop: insets.top + 8 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* header */}
      <View className="flex-row items-center justify-between px-5">
        <HeaderIcon name="chevron-left" onPress={() => router.back()} />
        <View className="items-center">
          <Text className="text-xl font-bold text-ink">Add Task</Text>
          <Text className="text-xs text-muted">Create a new task</Text>
        </View>
        <HeaderIcon name="help-circle" />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ padding: 20, paddingBottom: 24 }}
      >
        {/* Task Title */}
        <View className="rounded-3xl bg-white p-4" style={SHADOW}>
          <CardHeader icon="file-text" label="Task Title" required />
          <View className="rounded-2xl border border-[#ECECF3] bg-bg px-4 py-3">
            <TextInput
              value={title}
              onChangeText={setTitle}
              maxLength={100}
              placeholder="What do you want to do?"
              placeholderTextColor="#A8AEBC"
              multiline
              className="min-h-[64px] text-base text-ink"
              textAlignVertical="top"
            />
            <Text className="mt-1 self-end text-xs text-muted">{title.length}/100</Text>
          </View>
        </View>

        {/* Date + Time */}
        <View className="mt-4 flex-row gap-4">
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              Keyboard.dismiss();
              setShowDate(true);
            }}
            className="flex-1 flex-row items-center rounded-3xl bg-white p-4"
            style={SHADOW}
          >
            <View className="h-9 w-9 items-center justify-center rounded-xl bg-primary-light">
              <Feather name="calendar" size={18} color="#6C5CE7" />
            </View>
            <View className="ml-2.5 flex-1">
              <Text className="text-xs text-muted">Date</Text>
              <Text className="text-sm font-bold text-ink" numberOfLines={1}>
                {formatMediumDate(dateISO)}
              </Text>
            </View>
            <Feather name="chevron-down" size={18} color="#8A8F9C" />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              Keyboard.dismiss();
              setShowTime(true);
            }}
            className="flex-1 flex-row items-center rounded-3xl bg-white p-4"
            style={SHADOW}
          >
            <View className="h-9 w-9 items-center justify-center rounded-xl bg-primary-light">
              <Feather name="clock" size={18} color="#6C5CE7" />
            </View>
            <View className="ml-2.5 flex-1">
              <Text className="text-xs text-muted">Time</Text>
              <Text className="text-sm font-bold text-ink">{time}</Text>
            </View>
            <Feather name="chevron-down" size={18} color="#8A8F9C" />
          </TouchableOpacity>
        </View>

        {/* Priority */}
        <View className="mt-4 rounded-3xl bg-white p-4" style={SHADOW}>
          <CardHeader icon="flag" label="Priority" />
          <View className="flex-row gap-3">
            {PRIORITIES.map((p) => {
              const active = priority === p.value;
              return (
                <TouchableOpacity
                  key={p.value}
                  activeOpacity={0.8}
                  onPress={() => {
                    Keyboard.dismiss();
                    setPriority(p.value);
                  }}
                  className="flex-1 flex-row items-center justify-center gap-1.5 rounded-2xl py-3.5"
                  style={{
                    backgroundColor: p.bg,
                    borderWidth: 2,
                    borderColor: active ? p.color : "transparent",
                  }}
                >
                  <Ionicons name="flag" size={16} color={p.color} />
                  <Text className="text-sm font-semibold" style={{ color: p.color }}>
                    {p.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Repeat */}
        <View className="mt-4 rounded-3xl bg-white p-4" style={SHADOW}>
          <CardHeader icon="repeat" label="Repeat" />
          <View className="flex-row gap-3">
            {REPEATS.map((r) => {
              const active = repeat === r.value;
              return (
                <TouchableOpacity
                  key={r.value}
                  activeOpacity={0.8}
                  onPress={() => {
                    Keyboard.dismiss();
                    setRepeat(r.value);
                  }}
                  className={`flex-1 flex-row items-center justify-center gap-1.5 rounded-2xl py-3.5 ${
                    active ? "bg-primary-light" : "bg-bg"
                  }`}
                  style={{
                    borderWidth: 1.5,
                    borderColor: active ? "#6C5CE7" : "#ECECF3",
                  }}
                >
                  <Ionicons
                    name={r.icon}
                    size={16}
                    color={active ? "#6C5CE7" : "#8A8F9C"}
                  />
                  <Text
                    className="text-sm font-semibold"
                    style={{ color: active ? "#6C5CE7" : "#8A8F9C" }}
                  >
                    {r.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Notes */}
        <View className="mt-4 rounded-3xl bg-white p-4" style={SHADOW}>
          <CardHeader icon="align-left" label="Notes" optional />
          <View className="rounded-2xl border border-[#ECECF3] bg-bg px-4 py-3">
            <TextInput
              value={notes}
              onChangeText={setNotes}
              maxLength={200}
              placeholder="Add any notes here..."
              placeholderTextColor="#A8AEBC"
              multiline
              className="min-h-[72px] text-base text-ink"
              textAlignVertical="top"
            />
            <Text className="mt-1 self-end text-xs text-muted">{notes.length}/200</Text>
          </View>
        </View>

        {/* Reminder banner */}
        <View className="mt-4 flex-row items-center rounded-3xl bg-primary-light p-4">
          <View className="h-11 w-11 items-center justify-center rounded-full bg-primary">
            <Ionicons name="notifications" size={20} color="#fff" />
          </View>
          <Text className="ml-3 flex-1 text-sm text-ink">
            You will get a reminder notification at{" "}
            <Text className="font-bold text-primary">{time}</Text> on{" "}
            <Text className="font-bold text-primary">{formatLongDate(dateISO)}</Text>
          </Text>
        </View>
      </ScrollView>

      {/* Save button */}
      <View
        className="px-5 pt-3"
        style={{ paddingBottom: insets.bottom + 12 }}
      >
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={handleSave}
          disabled={!canSave}
          className="h-16 flex-row items-center justify-center rounded-3xl bg-primary"
          style={{
            opacity: canSave ? 1 : 0.5,
            shadowColor: "#5B4FE3",
            shadowOpacity: 0.35,
            shadowRadius: 16,
            shadowOffset: { width: 0, height: 8 },
            elevation: 6,
          }}
        >
          <Ionicons name="checkmark-circle" size={22} color="#fff" />
          <Text className="ml-2 text-lg font-bold text-white">Save Task</Text>
        </TouchableOpacity>
      </View>

      <PickerModal
        visible={showDate}
        title="Select Date"
        options={dateLabels}
        selected={formatLongDate(dateISO)}
        onSelect={(label) => setDateISO(dateOptions[dateLabels.indexOf(label)])}
        onClose={() => setShowDate(false)}
      />
      <PickerModal
        visible={showTime}
        title="Select Time"
        options={timeOptions}
        selected={time}
        onSelect={setTime}
        onClose={() => setShowTime(false)}
      />
    </KeyboardAvoidingView>
  );
}
