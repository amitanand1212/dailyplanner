import { Image, View } from "react-native";

/**
 * "Plan your day" hero — renders the production app logo asset.
 */
export default function PlannerIllustration() {
  return (
    <View className="h-72 w-full items-center justify-center">
      <Image
        source={require("../../assets/logo.png")}
        resizeMode="contain"
        className="h-full w-full"
      />
    </View>
  );
}
