import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Fab({
  bottom,
  onPress,
}: {
  bottom: number;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      className="absolute right-6 h-16 w-16 items-center justify-center rounded-full bg-primary-dark"
      style={{
        bottom,
        shadowColor: "#5B4FE3",
        shadowOpacity: 0.4,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
        elevation: 6,
      }}
    >
      <Ionicons name="add" size={32} color="#fff" />
    </TouchableOpacity>
  );
}
