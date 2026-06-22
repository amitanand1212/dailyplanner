import { useEffect, useRef } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNotificationStore } from "@/store/useNotificationStore";
import type { AppNotification } from "@/types/notification";

const SHADOW = {
  shadowColor: "#1A1D2E",
  shadowOpacity: 0.05,
  shadowRadius: 12,
  shadowOffset: { width: 0, height: 4 },
  elevation: 2,
} as const;

function timeAgo(ts: number) {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function Row({ item, fresh }: { item: AppNotification; fresh: boolean }) {
  const remove = useNotificationStore((s) => s.remove);
  return (
    <View
      className="mb-3 flex-row items-center rounded-2xl bg-white p-3.5"
      style={SHADOW}
    >
      <View className="h-11 w-11 items-center justify-center rounded-2xl bg-primary-light">
        <Text className="text-xl">{item.emoji}</Text>
      </View>
      <View className="ml-3 flex-1">
        <View className="flex-row items-center">
          {fresh ? (
            <View className="mr-1.5 h-2 w-2 rounded-full bg-primary" />
          ) : null}
          <Text className="flex-1 text-base font-bold text-ink" numberOfLines={1}>
            {item.title}
          </Text>
        </View>
        <Text className="text-xs text-muted" numberOfLines={2}>
          {item.body}
        </Text>
        <Text className="mt-0.5 text-[11px] text-muted">{timeAgo(item.createdAt)}</Text>
      </View>
      <TouchableOpacity
        onPress={() => remove(item.id)}
        hitSlop={8}
        className="ml-2 p-1"
      >
        <Feather name="x" size={18} color="#C7C9D4" />
      </TouchableOpacity>
    </View>
  );
}

export default function NotificationsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const notifications = useNotificationStore((s) => s.notifications);
  const markAllRead = useNotificationStore((s) => s.markAllRead);
  const clearAll = useNotificationStore((s) => s.clearAll);

  // Snapshot which were unread when the screen opened, then clear the badge.
  const freshIds = useRef<Set<string>>(new Set());
  useEffect(() => {
    freshIds.current = new Set(
      useNotificationStore
        .getState()
        .notifications.filter((n) => !n.read)
        .map((n) => n.id)
    );
    markAllRead();
  }, [markAllRead]);

  return (
    <View className="flex-1 bg-bg" style={{ paddingTop: insets.top + 8 }}>
      {/* header */}
      <View className="flex-row items-center justify-between px-5">
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => router.back()}
          className="h-11 w-11 items-center justify-center rounded-2xl bg-white"
          style={SHADOW}
        >
          <Feather name="chevron-left" size={20} color="#1A1D2E" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-ink">Notifications</Text>
        {notifications.length ? (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={clearAll}
            className="h-11 items-center justify-center rounded-2xl bg-white px-3"
            style={SHADOW}
          >
            <Text className="text-sm font-semibold text-primary">Clear</Text>
          </TouchableOpacity>
        ) : (
          <View className="h-11 w-11" />
        )}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 20,
          paddingBottom: insets.bottom + 24,
        }}
      >
        {notifications.length ? (
          notifications.map((n) => (
            <Row key={n.id} item={n} fresh={freshIds.current.has(n.id)} />
          ))
        ) : (
          <View className="mt-24 items-center">
            <View className="h-20 w-20 items-center justify-center rounded-full bg-primary-light">
              <Ionicons name="notifications-off-outline" size={36} color="#6C5CE7" />
            </View>
            <Text className="mt-4 text-base font-bold text-ink">No notifications</Text>
            <Text className="mt-1 px-10 text-center text-sm text-muted">
              Reminders for your tasks will show up here.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
