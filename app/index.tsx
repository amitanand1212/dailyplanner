import { ReactNode, useEffect, useMemo, useState } from "react";
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
import { Redirect, useRouter } from "expo-router";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppStore } from "@/store/useAppStore";
import { useUserStore } from "@/store/useUserStore";
import { useTaskStore } from "@/store/useTaskStore";
import { buildTimeOptions, todayISO } from "@/utils/date";
import PlannerIllustration from "@/components/onboarding/PlannerIllustration";
import PickerModal from "@/components/ui/PickerModal";
import HomeSkeleton from "@/components/ui/HomeSkeleton";

const SHADOW = {
  shadowColor: "#1A1D2E",
  shadowOpacity: 0.05,
  shadowRadius: 12,
  shadowOffset: { width: 0, height: 4 },
  elevation: 2,
} as const;

export default function Index() {
  const hasOnboarded = useAppStore((s) => s.hasOnboarded);
  const [hydrated, setHydrated] = useState(() =>
    useAppStore.persist.hasHydrated()
  );

  useEffect(() => {
    const unsub = useAppStore.persist.onFinishHydration(() => setHydrated(true));
    if (useAppStore.persist.hasHydrated()) setHydrated(true);
    return unsub;
  }, []);

  // Wait for persisted state so we don't flash the wrong screen.
  if (!hydrated) {
    return <HomeSkeleton />;
  }

  if (hasOnboarded) {
    return <Redirect href="/home" />;
  }

  return <Onboarding />;
}

function IconTile({ bg, children }: { bg: string; children: ReactNode }) {
  return (
    <View
      className="h-11 w-11 items-center justify-center rounded-full"
      style={{ backgroundColor: bg }}
    >
      {children}
    </View>
  );
}

function ScheduleField({ value, onPress }: { value: string; onPress: () => void }) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      className="mt-2 flex-row items-center justify-between rounded-2xl border border-[#ECECF3] bg-bg px-4 py-3.5"
    >
      <Text className="text-base font-semibold text-ink">{value}</Text>
      <Feather name="chevron-down" size={18} color="#8A8F9C" />
    </TouchableOpacity>
  );
}

function Onboarding() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const completeOnboarding = useAppStore((s) => s.completeOnboarding);
  const updateUser = useUserStore((s) => s.updateUser);
  const addTask = useTaskStore((s) => s.addTask);
  const timeOptions = useMemo(buildTimeOptions, []);

  const [name, setName] = useState("");
  const [wake, setWake] = useState("07:00 AM");
  const [sleep, setSleep] = useState("10:30 PM");
  const [showWake, setShowWake] = useState(false);
  const [showSleep, setShowSleep] = useState(false);

  const finish = (personalize: boolean) => {
    if (personalize) {
      updateUser({ name: name.trim() || "Friend", wakeTime: wake, sleepTime: sleep });
      // Turn the wake/sleep answers into daily routine tasks.
      const today = todayISO();
      addTask({ title: "Wake up", emoji: "☀️", dateISO: today, time: wake, priority: "medium", repeat: "daily" });
      addTask({ title: "Sleep", emoji: "🌙", dateISO: today, time: sleep, priority: "low", repeat: "daily" });
    }
    completeOnboarding();
    router.replace("/home");
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-bg"
      style={{ paddingTop: insets.top }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingBottom: insets.bottom + 20,
        }}
      >
        {/* skip */}
        <View className="items-end pt-2">
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => finish(false)}
            className="flex-row items-center rounded-full bg-white px-4 py-2"
            style={SHADOW}
          >
            <Text className="text-base font-bold text-primary">Skip</Text>
            <Ionicons name="chevron-forward" size={16} color="#6C5CE7" />
          </TouchableOpacity>
        </View>

        <PlannerIllustration />

        <Text className="mt-4 text-center text-4xl font-extrabold text-ink">
          Welcome!
        </Text>
        <Text className="mt-2 text-center text-base leading-6 text-muted">
          Let&apos;s set up a few things to personalize{"\n"}your daily planner 👋
        </Text>

        {/* form */}
        <View className="mt-7 rounded-3xl bg-white p-5" style={SHADOW}>
          {/* name */}
          <View className="flex-row items-start">
            <IconTile bg="#EDEBFB">
              <Ionicons name="person-outline" size={20} color="#6C5CE7" />
            </IconTile>
            <View className="ml-3 flex-1">
              <Text className="text-base font-bold text-ink">What&apos;s your name?</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Enter your name"
                placeholderTextColor="#A8AEBC"
                maxLength={30}
                returnKeyType="done"
                className="mt-2 rounded-2xl border border-[#ECECF3] bg-bg px-4 py-3.5 text-base text-ink"
              />
            </View>
          </View>

          <View className="my-4 h-px bg-[#F0F0F5]" />

          {/* wake */}
          <View className="flex-row items-start">
            <IconTile bg="#FEF3C7">
              <Ionicons name="sunny" size={20} color="#F59E0B" />
            </IconTile>
            <View className="ml-3 flex-1">
              <Text className="text-base font-bold text-ink">
                What time do you wake up?
              </Text>
              <ScheduleField
                value={wake}
                onPress={() => {
                  Keyboard.dismiss();
                  setShowWake(true);
                }}
              />
            </View>
          </View>

          <View className="my-4 h-px bg-[#F0F0F5]" />

          {/* sleep */}
          <View className="flex-row items-start">
            <IconTile bg="#DBEAFE">
              <Ionicons name="moon" size={20} color="#3B82F6" />
            </IconTile>
            <View className="ml-3 flex-1">
              <Text className="text-base font-bold text-ink">
                What time do you sleep?
              </Text>
              <ScheduleField
                value={sleep}
                onPress={() => {
                  Keyboard.dismiss();
                  setShowSleep(true);
                }}
              />
            </View>
          </View>
        </View>

        {/* continue */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => finish(true)}
          className="mt-6 h-16 flex-row items-center justify-center rounded-3xl bg-primary"
          style={{
            shadowColor: "#5B4FE3",
            shadowOpacity: 0.35,
            shadowRadius: 16,
            shadowOffset: { width: 0, height: 8 },
            elevation: 6,
          }}
        >
          <Text className="text-lg font-bold text-white">Continue</Text>
          <Ionicons name="arrow-forward" size={22} color="#fff" style={{ marginLeft: 8 }} />
        </TouchableOpacity>

        {/* page dots */}
        <View className="mt-6 flex-row items-center justify-center gap-2">
          <View className="h-2 w-6 rounded-full bg-primary" />
          <View className="h-2 w-2 rounded-full bg-primary/30" />
          <View className="h-2 w-2 rounded-full bg-primary/30" />
        </View>

        {/* privacy */}
        <View className="mt-4 flex-row items-center justify-center">
          <Feather name="lock" size={13} color="#8A8F9C" />
          <Text className="ml-1.5 text-xs text-muted">
            Your data stays private on your device
          </Text>
        </View>
      </ScrollView>

      <PickerModal
        visible={showWake}
        title="Wake up time"
        options={timeOptions}
        selected={wake}
        onSelect={setWake}
        onClose={() => setShowWake(false)}
      />
      <PickerModal
        visible={showSleep}
        title="Sleep time"
        options={timeOptions}
        selected={sleep}
        onSelect={setSleep}
        onClose={() => setShowSleep(false)}
      />
    </KeyboardAvoidingView>
  );
}
