import { View } from "react-native";
import { Tabs, useRouter, usePathname } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Fab from "@/components/ui/Fab";
import AdBanner from "@/components/ui/AdBanner";
import { BANNER_HEIGHT, isExpoGo } from "@/utils/ads";

const TAB_BAR_HEIGHT = 58;

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const pathname = usePathname();

  // Banner sits above the tab bar on Home only; lift the FAB clear of it so
  // nothing overlaps the ad (AdMob forbids tap targets over ads).
  const showBanner = pathname === "/home" && !isExpoGo;
  const fabBottom =
    insets.bottom + TAB_BAR_HEIGHT + 16 + (showBanner ? BANNER_HEIGHT : 0);

  return (
    <View className="flex-1 bg-bg">
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: "#6C5CE7",
          tabBarInactiveTintColor: "#8A8F9C",
          tabBarLabelStyle: { fontSize: 12, fontWeight: "600" },
          tabBarStyle: {
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: TAB_BAR_HEIGHT + insets.bottom,
            paddingTop: 8,
            paddingBottom: insets.bottom,
            backgroundColor: "#fff",
            borderTopWidth: 1,
            borderTopColor: "#EEF0F4",
            shadowColor: "#1A1D2E",
            shadowOpacity: 0.06,
            shadowRadius: 12,
            shadowOffset: { width: 0, height: -4 },
            elevation: 12,
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "home" : "home-outline"}
                size={24}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="calendar"
          options={{
            title: "Calendar",
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "calendar" : "calendar-outline"}
                size={24}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "person" : "person-outline"}
                size={24}
                color={color}
              />
            ),
          }}
        />
      </Tabs>

      {showBanner ? <AdBanner bottom={insets.bottom + TAB_BAR_HEIGHT} /> : null}

      <Fab bottom={fabBottom} onPress={() => router.push("/add-task")} />
    </View>
  );
}
