import { Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";

interface Props {
  progress: number; // 0..1
  size?: number;
  strokeWidth?: number;
}

export default function ProgressRing({
  progress,
  size = 104,
  strokeWidth = 10,
}: Props) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - Math.min(Math.max(progress, 0), 1));
  const pct = Math.round(progress * 100);
  const center = size / 2;

  return (
    <View style={{ width: size, height: size }} className="items-center justify-center">
      <Svg width={size} height={size}>
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke="#E4E1F7"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke="#6C5CE7"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${center} ${center})`}
        />
      </Svg>
      <View className="absolute items-center">
        <Text className="text-2xl font-extrabold text-ink">{pct}%</Text>
        <Text className="text-xs text-muted">Completed</Text>
      </View>
    </View>
  );
}
