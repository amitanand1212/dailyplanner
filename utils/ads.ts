import { Platform } from "react-native";
import Constants from "expo-constants";

/** Native ads SDK isn't available in Expo Go — guard usage (same as notifications). */
export const isExpoGo = Constants.appOwnership === "expo";

/** Reserved layout height (dp) for the anchored banner, used to offset other UI. */
export const BANNER_HEIGHT = 60;

/**
 * Banner ad unit ID — currently Google's official TEST unit, so it shows test
 * ads and is safe to ship. Replace with your real AdMob banner unit ID before
 * going live with real ads.
 */
export const BANNER_AD_UNIT_ID =
  Platform.select({
    android: "ca-app-pub-3940256099942544/6300978111",
    ios: "ca-app-pub-3940256099942544/2934735716",
  }) ?? "ca-app-pub-3940256099942544/6300978111";

/** Initialize the Mobile Ads SDK once at app start. No-op in Expo Go. */
export async function initializeAds() {
  if (isExpoGo) return;
  try {
    // Lazy require so Expo Go never evaluates the native ads module.
    const mobileAds = require("react-native-google-mobile-ads").default;
    await mobileAds().initialize();
  } catch {
    // SDK unavailable — ignore.
  }
}
