import { ReactNode } from "react";
import { Linking, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const SHADOW = {
  shadowColor: "#1A1D2E",
  shadowOpacity: 0.05,
  shadowRadius: 12,
  shadowOffset: { width: 0, height: 4 },
  elevation: 2,
} as const;

/** Shared scaffold for the legal / info screens (privacy, terms, about, help). */
export default function LegalLayout({
  title,
  updated,
  children,
}: {
  title: string;
  updated?: string;
  children: ReactNode;
}) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

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
        <Text className="text-xl font-bold text-ink">{title}</Text>
        <View className="h-11 w-11" />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 16,
          paddingBottom: insets.bottom + 32,
        }}
      >
        {updated ? (
          <Text className="mb-4 text-xs text-muted">Last updated: {updated}</Text>
        ) : null}
        {children}
      </ScrollView>
    </View>
  );
}

/** A titled section with body content. */
export function Section({
  heading,
  children,
}: {
  heading: string;
  children: ReactNode;
}) {
  return (
    <View className="mb-5">
      <Text className="mb-1.5 text-base font-bold text-ink">{heading}</Text>
      {children}
    </View>
  );
}

/** A body paragraph. */
export function P({ children }: { children: ReactNode }) {
  return (
    <Text className="mb-2 text-sm leading-6 text-muted">{children}</Text>
  );
}

/** A bulleted line. */
export function Bullet({ children }: { children: ReactNode }) {
  return (
    <View className="mb-1.5 flex-row pr-2">
      <Text className="mr-2 text-sm leading-6 text-primary">{"•"}</Text>
      <Text className="flex-1 text-sm leading-6 text-muted">{children}</Text>
    </View>
  );
}

/** A tappable email link rendered as primary-colored text. */
export function MailLink({ email }: { email: string }) {
  return (
    <Text
      className="text-sm font-semibold leading-6 text-primary"
      onPress={() => Linking.openURL(`mailto:${email}`)}
    >
      {email}
    </Text>
  );
}
