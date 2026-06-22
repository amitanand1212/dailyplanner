import { Text, View } from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import LegalLayout, { P } from "@/components/legal/LegalLayout";

const SHADOW = {
  shadowColor: "#1A1D2E",
  shadowOpacity: 0.05,
  shadowRadius: 12,
  shadowOffset: { width: 0, height: 4 },
  elevation: 2,
} as const;

/** A summary card with a leading icon, used for each data-safety statement. */
function InfoCard({
  icon,
  bg,
  title,
  body,
}: {
  icon: React.ReactNode;
  bg: string;
  title: string;
  body: string;
}) {
  return (
    <View className="mb-3 flex-row rounded-2xl bg-white p-4" style={SHADOW}>
      <View
        className="h-10 w-10 items-center justify-center rounded-2xl"
        style={{ backgroundColor: bg }}
      >
        {icon}
      </View>
      <View className="ml-3 flex-1">
        <Text className="mb-0.5 text-sm font-bold text-ink">{title}</Text>
        <Text className="text-sm leading-6 text-muted">{body}</Text>
      </View>
    </View>
  );
}

export default function DataSafetyScreen() {
  return (
    <LegalLayout title="Data Safety" updated="June 22, 2026">
      <P>
        Here's a clear summary of how Daily Planner handles your data. In short:
        everything stays on your device.
      </P>

      <InfoCard
        bg="#DCFCE7"
        icon={<Ionicons name="lock-closed" size={20} color="#22C55E" />}
        title="No data is collected by us"
        body="The app has no server. Your tasks, profile and settings are saved only on your device and are never sent to us."
      />

      <InfoCard
        bg="#DBEAFE"
        icon={<Ionicons name="share-social" size={20} color="#3B82F6" />}
        title="No data is shared"
        body="We do not share or sell any of your information to third parties."
      />

      <InfoCard
        bg="#EDEBFB"
        icon={<Ionicons name="notifications" size={20} color="#6C5CE7" />}
        title="Notifications stay on-device"
        body="Reminders are scheduled locally on your phone. They are not processed on any server."
      />

      <InfoCard
        bg="#FEF3C7"
        icon={<Ionicons name="trash" size={20} color="#F59E0B" />}
        title="You control your data"
        body="Delete everything anytime with Reset Data in Profile, or by uninstalling the app."
      />

      <View className="mt-1 flex-row items-start rounded-2xl bg-primary-light p-4">
        <Feather name="info" size={16} color="#6C5CE7" />
        <Text className="ml-2 flex-1 text-xs leading-5 text-primary">
          This summary matches the official Data Safety details shown on our Google
          Play listing.
        </Text>
      </View>
    </LegalLayout>
  );
}
