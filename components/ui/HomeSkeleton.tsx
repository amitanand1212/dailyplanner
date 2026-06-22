import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Skeleton from "./Skeleton";

/**
 * Skeleton placeholder shown while persisted state hydrates — mirrors the
 * Home screen layout (greeting, logo, progress card, tabs, task list).
 */
export default function HomeSkeleton() {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="flex-1 bg-bg"
      style={{ paddingTop: insets.top + 12, paddingHorizontal: 20 }}
    >
      {/* top action row (bell) */}
      <View className="flex-row justify-end">
        <Skeleton style={{ height: 48, width: 48, borderRadius: 16 }} />
      </View>

      {/* greeting + logo */}
      <View className="mt-5 flex-row items-center justify-between">
        <View className="flex-1 pr-3">
          <Skeleton style={{ height: 14, width: 90, borderRadius: 7 }} />
          <Skeleton style={{ height: 28, width: 165, borderRadius: 10, marginTop: 12 }} />
          <Skeleton style={{ height: 12, width: 135, borderRadius: 6, marginTop: 12 }} />
        </View>
        <Skeleton style={{ height: 104, width: 150, borderRadius: 24 }} />
      </View>

      {/* progress card */}
      <Skeleton style={{ height: 130, width: "100%", borderRadius: 26, marginTop: 28 }} />

      {/* section title */}
      <Skeleton style={{ height: 20, width: 150, borderRadius: 8, marginTop: 28 }} />

      {/* tabs */}
      <View className="mt-4 flex-row gap-3">
        <Skeleton style={{ height: 42, flex: 1, borderRadius: 14 }} />
        <Skeleton style={{ height: 42, flex: 1, borderRadius: 14 }} />
      </View>

      {/* task cards */}
      <View className="mt-4 gap-3">
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} style={{ height: 76, width: "100%", borderRadius: 20 }} />
        ))}
      </View>
    </View>
  );
}
