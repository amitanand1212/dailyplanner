import { Modal, Pressable, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface Props {
  visible: boolean;
  title: string;
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
  onClose: () => void;
}

export default function PickerModal({
  visible,
  title,
  options,
  selected,
  onSelect,
  onClose,
}: Props) {
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable className="flex-1 bg-black/40" onPress={onClose} />
      <View
        className="absolute bottom-0 left-0 right-0 rounded-t-3xl bg-white px-5 pt-5"
        style={{ paddingBottom: insets.bottom + 12, maxHeight: "70%" }}
      >
        <View className="mb-3 flex-row items-center justify-between">
          <Text className="text-lg font-bold text-ink">{title}</Text>
          <TouchableOpacity onPress={onClose} hitSlop={8}>
            <Ionicons name="close" size={24} color="#8A8F9C" />
          </TouchableOpacity>
        </View>
        <View className="mb-3 h-1 w-12 self-center rounded-full bg-bg" />

        <ScrollView showsVerticalScrollIndicator={false}>
          {options.map((opt) => {
            const active = opt === selected;
            return (
              <TouchableOpacity
                key={opt}
                activeOpacity={0.7}
                onPress={() => {
                  onSelect(opt);
                  onClose();
                }}
                className={`mb-2 flex-row items-center justify-between rounded-2xl px-4 py-3.5 ${
                  active ? "bg-primary-light" : "bg-bg"
                }`}
              >
                <Text
                  className={`text-base ${
                    active ? "font-bold text-primary" : "text-ink"
                  }`}
                >
                  {opt}
                </Text>
                {active ? (
                  <Ionicons name="checkmark-circle" size={22} color="#6C5CE7" />
                ) : null}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    </Modal>
  );
}
