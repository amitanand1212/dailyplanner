import { Image, Text, TouchableOpacity, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useUserStore } from "@/store/useUserStore";
import { useNotificationStore, selectUnreadCount } from "@/store/useNotificationStore";
import { formatWeekdayLong, greetingForNow, todayISO } from "@/utils/date";

function IconButton({
  name,
  badge,
  onPress,
}: {
  name: keyof typeof Feather.glyphMap;
  badge?: number;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      className="h-12 w-12 items-center justify-center rounded-2xl bg-white"
      style={{
        shadowColor: "#1A1D2E",
        shadowOpacity: 0.06,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 2,
      }}
    >
      <Feather name={name} size={22} color="#1A1D2E" />
      {badge ? (
        <View className="absolute -right-1 -top-1 h-5 w-5 items-center justify-center rounded-full bg-priority-high">
          <Text className="text-[10px] font-bold text-white">{badge}</Text>
        </View>
      ) : null}
    </TouchableOpacity>
  );
}

export default function Header() {
  const router = useRouter();
  const name = useUserStore((s) => s.name);
  const today = todayISO();
  const unread = useNotificationStore(selectUnreadCount);

  return (
    <View>
      {/* top action row */}
      <View className="flex-row items-center justify-end">
        <IconButton
          name="bell"
          badge={unread}
          onPress={() => router.push("/notifications")}
        />
      </View>

      {/* greeting + illustration */}
      <View className="mt-5 flex-row items-center justify-between">
        <View className="flex-1 pr-3">
          <Text className="text-base text-muted">{greetingForNow()},</Text>
          <Text className="text-3xl font-extrabold text-ink">{name} 👋</Text>
          <Text className="mt-1 text-sm text-muted">{formatWeekdayLong(today)}</Text>
        </View>
        <Image
          source={require("../../assets/logo.png")}
          resizeMode="contain"
          className="h-[104px] w-[150px]"
        />
      </View>
    </View>
  );
}
