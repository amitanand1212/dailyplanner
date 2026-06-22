import "../global.css";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import NotificationBanner from "@/components/ui/NotificationBanner";
import { useNotifications } from "@/hooks/useNotifications";

export const unstable_settings = {
  initialRouteName: "index",
};

export default function RootLayout() {
  useNotifications();

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="add-task"
          options={{ presentation: "modal", animation: "slide_from_bottom" }}
        />
        <Stack.Screen
          name="notifications"
          options={{ animation: "slide_from_right" }}
        />
        <Stack.Screen name="privacy-policy" options={{ animation: "slide_from_right" }} />
        <Stack.Screen name="data-safety" options={{ animation: "slide_from_right" }} />
        <Stack.Screen name="terms" options={{ animation: "slide_from_right" }} />
        <Stack.Screen name="about" options={{ animation: "slide_from_right" }} />
        <Stack.Screen name="help" options={{ animation: "slide_from_right" }} />
      </Stack>
      <NotificationBanner />
    </SafeAreaProvider>
  );
}
