import { View } from "react-native";
import { BANNER_AD_UNIT_ID, BANNER_HEIGHT, isExpoGo } from "@/utils/ads";

/**
 * Anchored adaptive banner ad, pinned above the tab bar on the Home screen.
 * Renders nothing in Expo Go, where the native ads module is unavailable.
 */
export default function AdBanner({ bottom }: { bottom: number }) {
  if (isExpoGo) return null;

  // Lazy require so Expo Go never evaluates the native ads SDK at import time.
  const { BannerAd, BannerAdSize } = require("react-native-google-mobile-ads");

  return (
    <View
      pointerEvents="box-none"
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom,
        minHeight: BANNER_HEIGHT,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <BannerAd
        unitId={BANNER_AD_UNIT_ID}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{ requestNonPersonalizedAdsOnly: true }}
      />
    </View>
  );
}
