import { useEffect, useRef } from "react";
import { Animated, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNotificationStore } from "@/store/useNotificationStore";

/**
 * Global overlay that slides a banner down from the top whenever a new in-app
 * notification fires. Auto-hides after a few seconds; tap opens the inbox.
 */
export default function NotificationBanner() {
  const banner = useNotificationStore((s) => s.banner);
  const dismissBanner = useNotificationStore((s) => s.dismissBanner);
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const translateY = useRef(new Animated.Value(-200)).current;
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hide = () => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    Animated.timing(translateY, {
      toValue: -200,
      duration: 220,
      useNativeDriver: true,
    }).start(() => dismissBanner());
  };

  useEffect(() => {
    if (!banner) return;
    translateY.setValue(-200);
    Animated.spring(translateY, {
      toValue: 0,
      useNativeDriver: true,
      friction: 9,
      tension: 80,
    }).start();
    hideTimer.current = setTimeout(hide, 4200);
    return () => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [banner]);

  if (!banner) return null;

  return (
    <Animated.View
      pointerEvents="box-none"
      style={{
        position: "absolute",
        left: 12,
        right: 12,
        top: insets.top + 8,
        transform: [{ translateY }],
        zIndex: 1000,
      }}
    >
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => {
          hide();
          router.push("/notifications");
        }}
        className="flex-row items-center rounded-3xl bg-white p-3.5"
        style={{
          shadowColor: "#1A1D2E",
          shadowOpacity: 0.16,
          shadowRadius: 18,
          shadowOffset: { width: 0, height: 8 },
          elevation: 14,
        }}
      >
        <View className="h-11 w-11 items-center justify-center rounded-2xl bg-primary-light">
          <Text className="text-xl">{banner.emoji}</Text>
        </View>
        <View className="ml-3 flex-1">
          <Text className="text-sm font-bold text-ink" numberOfLines={1}>
            {banner.title}
          </Text>
          <Text className="text-xs text-muted" numberOfLines={1}>
            {banner.body}
          </Text>
        </View>
        <TouchableOpacity onPress={hide} hitSlop={10} className="ml-2 p-1">
          <Ionicons name="close" size={18} color="#8A8F9C" />
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
}
