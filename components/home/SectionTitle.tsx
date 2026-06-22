import { Text } from "react-native";

export default function SectionTitle({ children }: { children: string }) {
  return (
    <Text className="mb-3 text-lg font-bold text-ink">{children}</Text>
  );
}
