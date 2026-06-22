import { Linking, Text, TouchableOpacity, View } from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useRouter, type Href } from "expo-router";
import LegalLayout, { P } from "@/components/legal/LegalLayout";
import {
  APP_NAME,
  APP_VERSION,
  DEVELOPER_NAME,
  SUPPORT_EMAIL,
} from "@/utils/appInfo";

const SHADOW = {
  shadowColor: "#1A1D2E",
  shadowOpacity: 0.05,
  shadowRadius: 12,
  shadowOffset: { width: 0, height: 4 },
  elevation: 2,
} as const;

function LinkRow({
  icon,
  label,
  onPress,
  last,
}: {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
  last?: boolean;
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      className={`flex-row items-center py-3.5 ${last ? "" : "border-b border-[#F0F0F5]"}`}
    >
      <View className="h-9 w-9 items-center justify-center rounded-2xl bg-primary-light">
        {icon}
      </View>
      <Text className="ml-3 flex-1 text-base font-semibold text-ink">{label}</Text>
      <Feather name="chevron-right" size={20} color="#C7C9D4" />
    </TouchableOpacity>
  );
}

export default function AboutScreen() {
  const router = useRouter();
  const go = (path: Href) => () => router.push(path);

  return (
    <LegalLayout title="About">
      {/* app identity */}
      <View className="items-center pb-2 pt-2">
        <View
          className="h-20 w-20 items-center justify-center rounded-3xl bg-primary"
          style={SHADOW}
        >
          <Ionicons name="calendar" size={40} color="#fff" />
        </View>
        <Text className="mt-3 text-xl font-extrabold text-ink">{APP_NAME}</Text>
        <Text className="mt-0.5 text-sm text-muted">Version {APP_VERSION}</Text>
      </View>

      <P>
        {APP_NAME} helps you plan your day, organize tasks by priority, and stay
        on track with timely reminders — all stored privately on your device.
      </P>

      {/* links */}
      <View className="mt-3 rounded-3xl bg-white px-4 py-1" style={SHADOW}>
        <LinkRow
          icon={<Ionicons name="shield-checkmark" size={18} color="#6C5CE7" />}
          label="Privacy Policy"
          onPress={go("/privacy-policy")}
        />
        <LinkRow
          icon={<Ionicons name="lock-closed" size={18} color="#6C5CE7" />}
          label="Data Safety"
          onPress={go("/data-safety")}
        />
        <LinkRow
          icon={<Ionicons name="document-text" size={18} color="#6C5CE7" />}
          label="Terms of Service"
          onPress={go("/terms")}
        />
        <LinkRow
          icon={<Ionicons name="help-circle" size={18} color="#6C5CE7" />}
          label="Help & Support"
          onPress={go("/help")}
          last
        />
      </View>

      <View className="mt-3 rounded-3xl bg-white px-4 py-1" style={SHADOW}>
        <LinkRow
          icon={<Ionicons name="mail" size={18} color="#6C5CE7" />}
          label="Contact Us"
          onPress={() => Linking.openURL(`mailto:${SUPPORT_EMAIL}`)}
          last
        />
      </View>

      <Text className="mt-6 text-center text-xs text-muted">
        © 2026 {DEVELOPER_NAME}. All rights reserved.
      </Text>
    </LegalLayout>
  );
}
