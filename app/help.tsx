import { Linking, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import LegalLayout, { P, Section } from "@/components/legal/LegalLayout";
import { SUPPORT_EMAIL } from "@/utils/appInfo";

const SHADOW = {
  shadowColor: "#1A1D2E",
  shadowOpacity: 0.05,
  shadowRadius: 12,
  shadowOffset: { width: 0, height: 4 },
  elevation: 2,
} as const;

const FAQS: { q: string; a: string }[] = [
  {
    q: "Why am I not getting reminders?",
    a: "Make sure notifications are allowed for Daily Planner in your device settings, and that battery optimization isn't restricting the app in the background.",
  },
  {
    q: "Where is my data stored?",
    a: "All your tasks and settings are saved locally on your device. Nothing is uploaded to a server.",
  },
  {
    q: "How do I delete all my data?",
    a: "Open Profile, then tap Reset Data. This permanently removes all tasks and restarts the app. Uninstalling the app also clears everything.",
  },
  {
    q: "Can I recover deleted tasks?",
    a: "Deleted tasks and reset data can't be recovered, so please be sure before resetting.",
  },
];

function Faq({ q, a }: { q: string; a: string }) {
  return (
    <View className="mb-3 rounded-2xl bg-white p-4" style={SHADOW}>
      <Text className="mb-1 text-sm font-bold text-ink">{q}</Text>
      <Text className="text-sm leading-6 text-muted">{a}</Text>
    </View>
  );
}

export default function HelpScreen() {
  return (
    <LegalLayout title="Help & Support">
      <P>
        Need a hand? Browse the common questions below, or get in touch and we'll
        be happy to help.
      </P>

      <Section heading="Frequently asked questions">
        {FAQS.map((f) => (
          <Faq key={f.q} q={f.q} a={f.a} />
        ))}
      </Section>

      <Section heading="Still need help?">
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => Linking.openURL(`mailto:${SUPPORT_EMAIL}`)}
          className="mt-1 h-14 flex-row items-center justify-center rounded-3xl bg-primary"
          style={SHADOW}
        >
          <Ionicons name="mail" size={18} color="#fff" />
          <Text className="ml-2 text-base font-bold text-white">Email Support</Text>
        </TouchableOpacity>
        <Text className="mt-2 text-center text-xs text-muted">{SUPPORT_EMAIL}</Text>
      </Section>
    </LegalLayout>
  );
}
