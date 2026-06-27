import { ReactNode, useMemo } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import {
  Feather,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTaskStore } from "@/store/useTaskStore";
import { useUserStore } from "@/store/useUserStore";
import { useAppStore } from "@/store/useAppStore";
import { dateToISO } from "@/utils/date";

/** Consecutive days ending today that have at least one completed task. */
function computeStreak(completedDays: Set<string>) {
  let streak = 0;
  const d = new Date();
  while (completedDays.has(dateToISO(d))) {
    streak += 1;
    d.setDate(d.getDate() - 1);
  }
  return streak;
}

const SHADOW = {
  shadowColor: "#1A1D2E",
  shadowOpacity: 0.05,
  shadowRadius: 12,
  shadowOffset: { width: 0, height: 4 },
  elevation: 2,
} as const;

interface Stat {
  value: string;
  label: string;
  icon: ReactNode;
  bg: string;
}

const STAT_VISUALS: Omit<Stat, "value">[] = [
  {
    label: "Tasks Completed", bg: "#EDEBFB",
    icon: <Ionicons name="checkmark-circle" size={22} color="#6C5CE7" />,
  },
  {
    label: "Day Streak", bg: "#FEF3C7",
    icon: <Ionicons name="flame" size={22} color="#F59E0B" />,
  },
  {
    label: "Productivity", bg: "#DCFCE7",
    icon: <Ionicons name="trending-up" size={22} color="#22C55E" />,
  },
  {
    label: "Focus Time", bg: "#DBEAFE",
    icon: <Ionicons name="time" size={22} color="#3B82F6" />,
  },
];

interface MenuItem {
  title: string;
  subtitle: string;
  bg: string;
  icon: ReactNode;
  onPress?: () => void;
  danger?: boolean;
}

/** Static visuals for the menu; onPress is wired up in the component. */
const MENU_VISUALS: Omit<MenuItem, "onPress">[] = [
  {
    title: "Help & Support", subtitle: "FAQs, contact us, and more", bg: "#EDEBFB",
    icon: <Ionicons name="help-circle" size={20} color="#6C5CE7" />,
  },
  {
    title: "Privacy Policy", subtitle: "How your data is handled", bg: "#DBEAFE",
    icon: <Ionicons name="shield-checkmark" size={20} color="#3B82F6" />,
  },
  {
    title: "Data Safety", subtitle: "What stays on your device", bg: "#FEF3C7",
    icon: <Ionicons name="lock-closed" size={20} color="#F59E0B" />,
  },
  {
    title: "Terms of Service", subtitle: "The rules for using the app", bg: "#DCFCE7",
    icon: <Ionicons name="document-text" size={20} color="#22C55E" />,
  },
  {
    title: "About App", subtitle: "Version 1.0.0", bg: "#EEF0F4",
    icon: <Ionicons name="information-circle" size={20} color="#8A8F9C" />,
  },
];

function StatTile({ stat }: { stat: Stat }) {
  return (
    <View className="flex-1 items-center">
      <View
        className="h-11 w-11 items-center justify-center rounded-2xl"
        style={{ backgroundColor: stat.bg }}
      >
        {stat.icon}
      </View>
      <Text className="mt-2 text-lg font-extrabold text-ink">{stat.value}</Text>
      <Text className="text-center text-[11px] text-muted">{stat.label}</Text>
    </View>
  );
}

function MenuRow({ item, last }: { item: MenuItem; last: boolean }) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={item.onPress}
      className={`flex-row items-center py-3.5 ${last ? "" : "border-b border-[#F0F0F5]"}`}
    >
      <View
        className="h-10 w-10 items-center justify-center rounded-2xl"
        style={{ backgroundColor: item.bg }}
      >
        {item.icon}
      </View>
      <View className="ml-3 flex-1">
        <Text
          className={`text-base font-semibold ${item.danger ? "text-priority-high" : "text-ink"}`}
        >
          {item.title}
        </Text>
        <Text className="text-xs text-muted">{item.subtitle}</Text>
      </View>
      <Feather name="chevron-right" size={20} color="#C7C9D4" />
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const tasks = useTaskStore((s) => s.tasks);
  const { name, email, plan, focusTime, wakeTime, sleepTime } = useUserStore();

  const stats: Stat[] = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed);
    const productivity = total ? Math.round((completed.length / total) * 100) : 0;
    const completedDays = new Set(completed.map((t) => t.dateISO));
    const values = [
      String(completed.length),
      String(computeStreak(completedDays)),
      `${productivity}%`,
      focusTime,
    ];
    return STAT_VISUALS.map((v, i) => ({ ...v, value: values[i] }));
  }, [tasks, focusTime]);

  // Wipe everything and return to the welcome screen — a clean first-run state.
  const startFresh = () => {
    useTaskStore.getState().clearTasks();
    useUserStore.getState().reset();
    useAppStore.getState().setOnboarded(false);
    router.replace("/");
  };

  const confirmReset = () =>
    Alert.alert(
      "Reset Data",
      "This permanently deletes all your tasks and restarts the app from the welcome screen.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Reset", style: "destructive", onPress: startFresh },
      ]
    );

  const confirmLogout = () =>
    Alert.alert("Log Out", "You'll be logged out and returned to the welcome screen.", [
      { text: "Cancel", style: "cancel" },
      { text: "Log Out", style: "destructive", onPress: startFresh },
    ]);

  // Map each menu row to its action by title; visuals live in MENU_VISUALS.
  const onPressByTitle: Record<string, () => void> = {
    "Help & Support": () => router.push("/help"),
    "Privacy Policy": () => router.push("/privacy-policy"),
    "Data Safety": () => router.push("/data-safety"),
    "Terms of Service": () => router.push("/terms"),
    "About App": () => router.push("/about"),
  };
  const menu: MenuItem[] = MENU_VISUALS.map((item) => ({
    ...item,
    onPress: onPressByTitle[item.title],
  }));

  const dangerItems: MenuItem[] = [
    {
      title: "Reset Data",
      subtitle: "Delete all tasks and start over",
      bg: "#FEE2E2",
      icon: <Ionicons name="trash" size={20} color="#EF4444" />,
      onPress: confirmReset,
      danger: true,
    },
  ];

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
        <View className="flex-row items-center">
          <Text className="text-3xl font-extrabold text-ink">Profile</Text>
        </View>

        {/* profile card */}
        <View className="mt-5 flex-row items-center rounded-3xl bg-primary-light p-4">
          <View className="h-16 w-16 items-center justify-center rounded-full bg-primary">
            <Ionicons name="person" size={32} color="#fff" />
          </View>
          <View className="ml-4 flex-1">
            <Text className="text-xl font-extrabold text-ink">{name} 👋</Text>
            <Text className="text-sm text-muted">{email || "No email added"}</Text>
            <View className="mt-1.5 flex-row items-center self-start rounded-full bg-white px-2.5 py-1">
              <MaterialCommunityIcons name="crown" size={13} color="#6C5CE7" />
              <Text className="ml-1 text-xs font-semibold text-primary">{plan}</Text>
            </View>
          </View>
        </View>

        {/* overview */}
        <View className="mt-6 flex-row items-center justify-between">
          <Text className="text-lg font-bold text-ink">Your Overview</Text>
        </View>

        <View className="mt-3 flex-row rounded-3xl bg-white p-5" style={SHADOW}>
          {stats.map((s) => (
            <StatTile key={s.label} stat={s} />
          ))}
        </View>

        {/* daily schedule (from onboarding) */}
        <Text className="mt-6 text-lg font-bold text-ink">Daily Schedule</Text>
        <View className="mt-3 flex-row items-center rounded-3xl bg-white p-4" style={SHADOW}>
          <View className="flex-1 flex-row items-center">
            <View
              className="h-10 w-10 items-center justify-center rounded-2xl"
              style={{ backgroundColor: "#FEF3C7" }}
            >
              <Ionicons name="sunny" size={20} color="#F59E0B" />
            </View>
            <View className="ml-3">
              <Text className="text-xs text-muted">Wake up</Text>
              <Text className="text-base font-bold text-ink">{wakeTime}</Text>
            </View>
          </View>
          <View className="h-10 w-px bg-[#F0F0F5]" />
          <View className="flex-1 flex-row items-center pl-4">
            <View
              className="h-10 w-10 items-center justify-center rounded-2xl"
              style={{ backgroundColor: "#DBEAFE" }}
            >
              <Ionicons name="moon" size={20} color="#3B82F6" />
            </View>
            <View className="ml-3">
              <Text className="text-xs text-muted">Sleep</Text>
              <Text className="text-base font-bold text-ink">{sleepTime}</Text>
            </View>
          </View>
        </View>

        {/* menu */}
        <View className="mt-5 rounded-3xl bg-white px-4 py-1" style={SHADOW}>
          {menu.map((item, i) => (
            <MenuRow key={item.title} item={item} last={i === menu.length - 1} />
          ))}
        </View>

        {/* settings / danger zone */}
        <View className="mt-4 rounded-3xl bg-white px-4 py-1" style={SHADOW}>
          {dangerItems.map((item, i) => (
            <MenuRow key={item.title} item={item} last={i === dangerItems.length - 1} />
          ))}
        </View>

        {/* log out */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={confirmLogout}
          className="mt-5 h-14 flex-row items-center justify-center rounded-3xl bg-white"
          style={SHADOW}
        >
          <Feather name="log-out" size={18} color="#EF4444" />
          <Text className="ml-2 text-base font-bold text-priority-high">Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
